import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PersonService } from './person.service';
import { StatusTypeService } from 'src/statusType/statusType.service';
import { CreatePersonDto } from './dto/createPerson.dto';
import { UpdatePersonDto } from './dto/updatePerson.dto';
import mongoose from 'mongoose';
import { DocumentTypeService } from 'src/documentType/documentType.service';

@Controller('person')
export class PersonController {
  constructor(
    private service: PersonService,
    private statusTypeService: StatusTypeService,
    private documentTypeService : DocumentTypeService
  ){}

  @Get()
  async list(){
    try {
      return await this.service.list();
    } catch (error) {
      throw error;
    }
  }

  @Post('listPersonAsync')
  async listPersonAsync(@Body() body: any, @Req() req: Request){
    try {
      const { page = 0, limit = 50} = body;
      let skip = 0;
      let query: any = {};
    
      if (page && limit) {
        skip = page * limit;
      }
      
      return await this.service.listWithParamsAsync(query, skip, limit);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findId(@Param('id') id:string){
    try {
      const response =  await this.service.findId(id);
      console.log("response ",response);
      
      if(!response) throw new NotFoundException('Elemento no encontrado..!');
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  @Post()
  async create(@Body() body: CreatePersonDto, @Req() req: Request){
    try {
      if(!body.idStatusType){
        const statusType = await this.statusTypeService.findOneWithParams({name:"Activo", proccess: "Person"});
        if(!statusType) throw 'Tipo de Estado Activo no encontrado..!';
        body.idStatusType = statusType?._id;
      }else{
        body.idStatusType = new mongoose.Types.ObjectId(body?.idStatusType);
      }
      if(!body.documentTypeId){
        const documentType = await this.documentTypeService.findOneWithParams({name:"DNI", proccess: "Identificación"});
        if(!documentType) throw 'Tipo de Documento DNI no encontrado..!';
        body.documentTypeId = documentType?._id;
      }else{
        body.documentTypeId = new mongoose.Types.ObjectId(body?.documentTypeId);
      }

      const response = await this.service.create(body);
      return response
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Put(':id')
  async update(@Param('id')  id : string, @Body() body: UpdatePersonDto, @Req() req: Request){
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
