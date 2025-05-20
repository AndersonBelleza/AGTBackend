import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException, UseInterceptors, UploadedFiles, InternalServerErrorException } from '@nestjs/common';
import { SiteService } from './site.service';
import mongoose from 'mongoose';
import { StatusTypeService } from 'src/statusType/statusType.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CompanyService } from 'src/company/company.service';
import { createFolder, uploadFileS3Many, verifyFolder } from 'src/utilities/awsMulter';

@Controller('site')
export class SiteController {
  constructor(
    private service: SiteService,
    private statusTypeService : StatusTypeService,
    private companyService : CompanyService,

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

  @Post('loadFirstData')
  async loadFirstData(@Body() body: any, @Req() req: Request){
    try {
      const company = await this.companyService.list();
      if(!company) throw (`No hay empresa ..!`);
      const firstCompany = company[0];
      console.log("firstCompany ",firstCompany);
      const site = await this.service.findOneWithParams({idCompany : firstCompany?._id});
      console.log("site ",site);
      if(!site) throw (`Empresa ${firstCompany?.businessName} no tiene Sede ..!`);
  
      return {
        idSite : site?._id,
        idCompany : firstCompany?._id,
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  
  @Post('searchWithParam')
  async searchWithParam(@Body() body: any, @Req() req: Request){
    try {      
      const response = await this.service.listWithParamsPopulate(body);
      return response
    } catch (error) {
      throw error
    }
  }

  @Post()
  async create(@Body() body: any, @Req() req: Request){
    try {
      if(!body.idStatusType){
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

  @Put(':id')
  async update(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    try {
      body.idDistrict = new mongoose.Types.ObjectId(body?.idDistrict);
      const response = await this.service.update(id, body);
      if(!response) throw new NotFoundException('Elemento no encontrado...!');
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  @Post('update')
  async updateUser(@Body() body: any, @Req() req: Request){
    try {
      const idSite = body?.id;
      delete body.id;
      
      const response = await this.service.update(idSite, body);
      if(!response) throw new NotFoundException('Elemento no encontrado...!');
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('updateLogo')
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: memoryStorage(), // Almacenar el archivo en memoria para manejarlo manualmente
  }))
  async updateLogo(@Body() body: any, @Req() req: Request, @UploadedFiles() files: Express.Multer.File[]) {
    try {
      body = JSON.parse(body?.data);
      
      if (files?.length > 0) {
        let company = await this.companyService.findId(body.idCompany.toString());
        let site: any = await this.service.findId(body.idSite.toString());
  
        if (!company) {
          throw 'Error al subir el archivo: carpeta no creada';
        }
  
        let folderBase = company.businessName;
        const verify = await verifyFolder(folderBase);
        if (verify.exists == false) {
          const folder = await createFolder(folderBase);
          if (!folder.success) {
            return folder.message;
          }
        }
  
        let folder2 = `${folderBase}/LOGOS`;
        const verify2 = await verifyFolder(folder2);
        if (verify2.exists == false) {
          const folder = await createFolder(folder2);
          if (!folder.success) {
            return folder.message;
          }
        }
  
        let filesUpload = [files[0]];
  
        let params = { files: filesUpload, destinationPath: folder2 + "/" };
        const resFiles: any = await uploadFileS3Many(params);
        
        if (resFiles.success) {
          const promiseResult = resFiles?.data?.map(async (item: any) => {
            return {
              url: item.location,
              fileType: item.fileType,
              size: item.size,
            };
          });
  
          let filesRegister = await Promise.all(promiseResult);
          body.image = filesRegister;
        }
  
        // Asegurarse de que site.logo sea un array antes de combinar
        const existingLogos = Array.isArray(site?.logo) ? site.logo : [];
  
        const updatedLogos = [...existingLogos, ...body.image];
        console.log("updatedLogos", site?.logo)
        const response = await this.service.update(body?.idSite, { logo: updatedLogos });
        return response;
      }
  
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
}
