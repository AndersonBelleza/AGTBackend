import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put } from '@nestjs/common';
import { DocumentTypeService } from './documentType.service';
import { StatusTypeService } from 'src/statusType/statusType.service';
import { CreateDocumentTypeDto } from './dto/createDocumentType.dto';
import { UpdateDocumentTypeDto } from './dto/updateDocumentType.dto';
import mongoose from 'mongoose';

@Controller('documentType')
export class DocumentTypeController {
  constructor(
    private service: DocumentTypeService,
    private statusTypeService: StatusTypeService,
  ){}

  @Get()
  async list(){
    try {
      return await this.service.list();
    } catch (error) {
      throw error;
    }
  }
  @Get('filter/:proccess')
  async listFilter(@Param('proccess') process : any){
    try {
      let json:any = {};
      if(process){
        json.proccess = process
      }
      return await this.service.listWithParams(json);
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
  async create(@Body() body: CreateDocumentTypeDto, @Req() req: Request){
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
  async update(@Param('id')  id : string, @Body() body: UpdateDocumentTypeDto, @Req() req: Request){
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
