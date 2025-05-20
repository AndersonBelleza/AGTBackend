import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { BannerService } from './banner.service';
import { StatusTypeService } from 'src/statusType/statusType.service';
import { UpdateProductSubCategoryDto } from 'src/productSubCategory/dto/updateProductSubCategory.dto';
import { CreateBannerDto } from './dto/createBanner.dto';
import mongoose from 'mongoose';
import { memoryStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createFolder, uploadFileS3Many, verifyFolder } from 'src/utilities/awsMulter';
import { CompanyService } from 'src/company/company.service';

@Controller('banner')
export class BannerController {
  constructor(
    private service: BannerService,
    private statusTypeService: StatusTypeService,
    private companyService : CompanyService
  ){}

  @Get()
  async list(){
    try {
      let query:any = {}
      // let statusTypeSelected = await this.statusTypeService.findOneWithParams({name : 'Inactivo', proccess : "Default"});
      // if(statusTypeSelected){
      //   query = {idStatusType : {$ne : statusTypeSelected._id}};
      // }


      return await this.service.listWithParamsPopulate(query);
    } catch (error) {
      console.log("error",error);
      throw error;
    }
  }

  @Get("ignoreInactive")
  async listNotInactive(){
    try {
      // console.log("ignoreInactive");
      let query:any = {}
      let statusTypeSelected = await this.statusTypeService.findOneWithParams({name : 'Activo', proccess : "Default"});
      if(statusTypeSelected){
        query = {idStatusType : statusTypeSelected._id};
      }


      return await this.service.listWithParamsPopulate(query);
    } catch (error) {
      console.log("error",error);
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
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: memoryStorage(), // Almacenar el archivo en memoria para manejarlo manualmente
  }))
  async create(@Body() body: any, @Req() req: Request, @UploadedFiles() files: Express.Multer.File[]){
    try {
      console.log("bodybanner",body);
      if(!body.idStatusType){
        // Cambiar proccess si es necesario, por ahora lo dejo con Default
        const statusType = await this.statusTypeService.findOneWithParams({name:"Activo", proccess: "Default"});
        if(!statusType) throw 'Tipo de Estado Activo no encontrado..!';
        body.idStatusType = statusType?._id;
      }else{
        body.idStatusType = new mongoose.Types.ObjectId(body?.idStatusType);
      }

      if(body.idCompany){
        body.idCompany = new mongoose.Types.ObjectId(body.idCompany)
      }
      if(body.idSite){
        body.idSite = new mongoose.Types.ObjectId(body.idSite)
      }
      if(body.title){
        body.name = body.title;
      }
      if(files?.length > 0){
        let conpany = await this.companyService.findId(body.idCompany.toString());
        if(!conpany){
          throw 'Error al subir el archivo carpeta no creada';
        }
        let folderBase = conpany.businessName;
        const verify = await verifyFolder(folderBase);
        if (verify.exists == false) {
          const folder = await createFolder(folderBase);
          if (!folder.success) {
            return folder.message;
          }
        }

        let folder2 = `${folderBase}/BANNER`;
        const verify2 = await verifyFolder(folder2);
        if (verify2.exists == false) {
          const folder = await createFolder(folder2);
          if (!folder.success) {
            return folder.message;
          }
        }

        let filesUpload = [files[0]];

        let params = { files : filesUpload, destinationPath: folder2 + "/", };
        const resFiles: any = await uploadFileS3Many(params)
        if (resFiles.success) {
          const promiseResult = resFiles?.data?.map(async (item: any, index: number) => {
            return {
              url: item.location,
              orden: index + 1,
              fileType: item.fileType,
              size: item.size,
            }
          })

          let filesRegister = await Promise.all(promiseResult);
          body.image = filesRegister[0];
        }
      }
      
      const response = await this.service.create(body);
      return response
    } catch (error) {
      throw error
    }
  }

  @Put(':id')
  async update(@Param('id')  id : string, @Body() body: UpdateProductSubCategoryDto, @Req() req: Request){
    try {
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

  @Put('changeStatus/:id')
  async changeStatus(@Body() body: any, @Param('id') id : string ,@Req() req: Request){
    try{
      let status = "";
      let valid = body.checked || "true";

      if(valid == "false"){
        console.log("vaslidfalse");
        status = 'Inactivo';
      }

      if(valid == "true"){
        console.log("vaslidfalse");
        status = 'Activo';

      }
      console.log("status",status);

      let statusTypeSelected = await this.statusTypeService.findOneWithParams({name : status, proccess : "Default"});
      if(!statusTypeSelected){
        throw 'No existe el estado'
      }

      let productUpdated = await this.service.update(id,{idStatusType : statusTypeSelected._id});
      return productUpdated;

    }catch(error){
      console.log("error",error);
      throw error
    }
  }
}
