import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, InternalServerErrorException } from '@nestjs/common';
import { CompanyService } from './company.service';
import { StatusTypeService } from 'src/statusType/statusType.service';
import mongoose from 'mongoose';
import { DocumentTypeService } from 'src/documentType/documentType.service';
import { CountryService } from 'src/country/country.service';

@Controller('company')
export class CompanyController {
  constructor(
    private service: CompanyService,
    private statusTypeService: StatusTypeService,
    private documentTypeService: DocumentTypeService,
    private countryService : CountryService
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
      if(!response) throw 'Elemento no encontrado..!';
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  
  @Post()
  async create(@Body() body: any, @Req() req: Request){
    try {
      if(!body.idStatusType){
        const statusType = await this.statusTypeService.findOneWithParams({name:"Activo", proccess: "Company"});
        if(!statusType) throw 'Tipo de Estado Activo no encontrado...!';
        body.idStatusType = statusType?._id;
      }else{
        body.idStatusType = new mongoose.Types.ObjectId(body?.idStatusType);
      }

      // if(!body.countryId){
      //   const country = await this.statusTypeService.findOneWithParams({name:"Activo", proccess: "Default"});
      //   if(!country) throw 'Tipo de Estado Activo no encontrado..!';
      //   body.country = country?._id;
      // }else{
      //   body.countryId = new mongoose.Types.ObjectId(body?.countryId);
      // }

      if(!body.documentTypeId){
        const documentType = await this.documentTypeService.findOneWithParams({name:"RUC", proccess: "Identificación"});
        if(!documentType) throw 'Tipo de Documento Identificación no encontrado..!';
        body.documentTypeId = documentType?._id;
      }else{
        body.documentTypeId = new mongoose.Types.ObjectId(body?.documentTypeId);
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
}
