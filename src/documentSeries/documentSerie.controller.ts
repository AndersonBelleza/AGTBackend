import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, InternalServerErrorException } from '@nestjs/common';
import { DocumentSerieService } from './documentSerie.service';
import { StatusTypeService } from 'src/statusType/statusType.service';
import { UpdateProductSubCategoryDto } from 'src/productSubCategory/dto/updateProductSubCategory.dto';
import { CreateDocumentSerieDto } from './dto/createDocumentSerie.dto';
import mongoose, { mongo } from 'mongoose';
import { UpdateDocumentSerieDto } from './dto/updateDocumentSerie.dto';
import { DocumentTypeService } from 'src/documentType/documentType.service';
import { SiteService } from 'src/site/site.service';

@Controller('documentSerie')
export class DocumentSerieController {
  constructor(
    private service: DocumentSerieService,
    private statusTypeService: StatusTypeService,
    private documentTypeService : DocumentTypeService,
    private siteService: SiteService,
  ){}

  @Get()
  async list(){
    try {
      return await this.service.list();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findId(@Param('id') id:string){
    try {
      const response =  await this.service.findId(id);
      if(!response) throw new NotFoundException('Elemento no encontrado..!');
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  @Post()
  async create(@Body() body: any, @Req() req: Request){
    try {
      if(!body.idStatusType){
        // Cambiar proccess si es necesario, por ahora lo dejo con Default
        const statusType = await this.statusTypeService.findOneWithParams({name:"Activo", proccess: "Default"});
        if(!statusType) throw 'Tipo de Estado Activo no encontrado..!';
        body.idStatusType = statusType?._id;
      }else{
        body.idStatusType = new mongoose.Types.ObjectId(body?.idStatusType);
      }
      
      const response = await this.service.create(body);
      return response
    } catch (error) {
      throw error
    }
  }

  // SOLO PARA SERIE - CORRELATIVO DE PRODUCTO
  @Post('searchProductDocSerie')
  async searchProductDocSerie(@Body() body: any, @Req() req: Request){
    try {
      let query:any = {};      
      if(body.idCompany){
        query.idCompany = new mongoose.Types.ObjectId(body.idCompany);
      }
      if(body.idSite){
        query.idSite = new mongoose.Types.ObjectId(body.idSite);

      }
      if(body.serie){
        // query.serie = body.serie;
      }
      if(body.correlative){
        // query.correlative = body.correlative;
      }

      if(!body.idStatusType){
        const statusType = await this.statusTypeService.findOneWithParams({name:"Activo", proccess: "Default"});
        if(!statusType) throw 'Tipo de Estado Activo no encontrado..!';
        body.idStatusType = statusType?._id;
      }else{
        body.idStatusType = new mongoose.Types.ObjectId(body?.idStatusType);
      }


      if(!body.idDocumentType){
        const documentType = await this.documentTypeService.findOneWithParams({name:"SKU", proccess: "Product"});
        if(!documentType){
          let resDoc = await this.documentTypeService.create(
            {name:"SKU", proccess: "Product",idStatusType : body.idStatusType}
          );
          if(!resDoc) throw "Error al registrar Tipo documento";
          body.idDocumentType = resDoc?._id;
          query.idDocumentType = resDoc?._id;
        }else{
          body.idDocumentType = documentType?._id;
          query.idDocumentType = documentType?._id;
        }
      }else{
        query.idDocumentType = new mongoose.Types.ObjectId(body?.idDocumentType);
      }


      
      const response = await this.service.findOneWithParams(query);
      // console.log("responseDocSerie",response);
      if(response){
        return response
      }
      const responseRegister = await this.service.create({...query, idStatusType : body.idStatusType, correlative : 1, serie : "PRODUCTSERIE"});
      // console.log("responseDocSerieRegister",responseRegister);

      return responseRegister
    } catch (error) {
      throw error
    }
  }

  @Post('searchSerieSite')
  async searchSerieSite(@Body() body: any, @Req() req: Request){
    try {
      const data  = {
        name : body?.document,
        proccess : body?.proccess,
      }
      console.log("data ",data);
      
      const documentType = await this.documentTypeService.findOneWithParams(data);
      if(!documentType) throw (`Tipo de documento ${documentType?.name} no encontrado...!`);
      console.log("documentType ",documentType);

      const dataDocumentSerie  = {
        idSite : new mongoose.Types.ObjectId(body?.idSite),
        idDocumentType : documentType?._id
      }

      // console.log("dataDocumentSerie ",dataDocumentSerie);
      var response = await this.service.findOneWithParams(dataDocumentSerie);
      var response2;
      if(!response){
        const statusType = await this.statusTypeService.findOneWithParams({name:"Activo", proccess: "Default  "});
        // console.log("statusType ",statusType);
        const site =  await this.siteService.findId(body?.idSite);
        response2 = await this.service.create(
          { 
            serie: body?.serie, 
            correlative : 1, 
            idDocumentType : documentType?._id, 
            idCompany : new mongoose.Types.ObjectId(site?.idCompany), 
            idSite : site?._id,
            idStatusType : statusType?._id,
          }
        );
      }else{
        response2 = response;
      }

      if(!response2) throw (`Documento ${documentType?.name} con serie no encontrado...!`);
      
      return response2;

    } catch (error) {
      console.log("error ",error);
      throw new InternalServerErrorException(error);
    }
  }


  @Put(':id')
  async update(@Param('id')  id : string, @Body() body: UpdateDocumentSerieDto, @Req() req: Request){
    try {
      body.idDocumentType = new mongoose.Types.ObjectId(body?.idDocumentType);

      const response = await this.service.update(id, body);
      
      if(!response) throw new NotFoundException('Elemento no encontrado...!');
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id:string, @Req() req: Request){
    try {
      const response = await this.service.delete(id);
      if(!response) throw new NotFoundException('Elemento no eliminado...!');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // APK

  @Post('getDocumentSerie')  
  async getDocumentSerie(@Body() body: any, @Req() req: Request){
    try {
      const data  = {
        name : body?.document,
        proccess : body?.proccess,
      }
      const documentType = await this.documentTypeService.findOneWithParams(data);
      if(!documentType) throw ('Tipo de documento no encontrado...!');

      const dataDocumentSerie  = {
        idSite : body?.idSite,
        idDocumentType : documentType?._id
      }

      var response = await this.service.listWithParamsAsync(dataDocumentSerie);

      if(response?.length == 0) {
        const statusType = await this.statusTypeService.findOneWithParams({name:"Activo", proccess: "Default  "});
        const site =  await this.siteService.findId(body?.idSite);
  
        const documentGenerate = await this.service.create({ 
          serie: body?.document, 
          correlative : 1, 
          idDocumentType : documentType?._id, 
          idCompany : new mongoose.Types.ObjectId(site?.idCompany), 
          idSite : new mongoose.Types.ObjectId(body?.idSite),
          idStatusType : statusType?._id,
        });

        return [documentGenerate]
      }

      return response;

    } catch (error) {
      console.log("error ",error);
      throw new InternalServerErrorException(error);
    }
  }
  
}
