import { VertexAI } from '@google-cloud/vertexai';
import { HttpService } from '@nestjs/axios';
import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, InternalServerErrorException, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import mongoose from 'mongoose';
import * as multer from 'multer';
import { catchError, lastValueFrom, map } from 'rxjs';
import { CompanyService } from 'src/company/company.service';
import { DocumentTypeService } from 'src/documentType/documentType.service';

@Controller('operation')
export class OperationController {

  constructor(
    private httpService: HttpService,
    private companyService: CompanyService,
    private documentTypeService: DocumentTypeService,
    
  ) {}

  @Post('IA')
  @UseInterceptors(FilesInterceptor('files', 1000, {
    storage: multer.memoryStorage(), // Almacenar el archivo en memoria para manejarlo manualmente
  }))
  async textIA(@Body() formData: any, @UploadedFiles() files: Express.Multer.File[], @Req() req: Request) {
    try {
      const body: any = JSON.parse(formData?.data);

      const vertex_ai = new VertexAI({project: 'vamas-429217', location: 'us-central1'});
      const model = 'gemini-flash-experimental';

      const generativeModel = vertex_ai.getGenerativeModel({
        model: model,
        generationConfig: {
          'maxOutputTokens': 8192,
          'temperature': 1,
          'topP': 0.95,
        },
        systemInstruction: {
          parts: [{"text": body?.instruction}],
          role : "user"
        },
      });

      var file64 = [];
      var file64log = [];

      if (files?.length > 0) {
        for (let index = 0; index < files?.length; index++) {

          const archivo = files[index];
          const base64String = archivo.buffer.toString('base64'); // Convierte el buffer a base64
          const mimeType = archivo.mimetype; // Obtiene el tipo MIME

          file64.push({
            inlineData : {
              mimeType: mimeType,
              data: base64String,
            }
          });

          file64log.push({
            inlineData : {
              mimeType: mimeType,
            }
          });
        }
      }

      file64.push({
        text : body?.text
      });

      file64log.push({
        text : body?.text
      });
       
      // console.log("file64 ", file64);
      // console.log("file64log ", file64log);

      const data = {
        contents: [
          {role: 'user', parts: file64}
        ],
      };

      const streamingResp = await generativeModel.generateContentStream(data);
      const aggregatedResponse = await streamingResp.response;
      const responseData = aggregatedResponse.candidates[0].content.parts[0].text;

      // console.log("responseData",responseData);
      return {data:responseData};
    } catch (error) {
      console.log("error ",error);
      throw new InternalServerErrorException(error)
    }

  }

  @Get('searchRUC/:val')
  async searchRUC(@Param('val')  val : string) {
    try {
      const company = await this.companyService.findOneWithParams({documentNumber : val});
      if(company?._id){
        return company
      }else{
        const responseData = await lastValueFrom(this.httpService.get('https://app.minam.gob.pe/TransparenciaWSREST/tramites/transparencia/sunatDetalle?ruc=' + val,
          {
            responseType: 'json',
            headers: {
              'Content-Type': 'application/json'
            }
          }).pipe(
            map((response) => {
              return response.data
            }),
            catchError((error) => {
              return `Error al procesar la respuesta: ${error.message}`;
            })
          )
        );
        console.log("responseData",responseData);
        if(responseData?.status == true && responseData?.data?.ddpNombre != ""){
  
          const documentType = await this.documentTypeService.findOneWithParams({name:"RUC", proccess: "Identificación"});
          if(!documentType) throw 'Tipo de Documento RUC no encontrado..!';
  
          const companyRegister = this.companyService.create({
            documentNumber : val,
            username : val,
            password : val,
            businessName :responseData?.data?.ddpNombre,
            commercialName : responseData?.data?.ddpNombre,
            address : responseData?.data?.ddpDomicilioLegal,
            documentTypeId : documentType?._id,
          });
    
          return companyRegister
        }else{
          throw {message :"Error en la consulta Intentelo en otro momento"}
        }
      }

    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

}
