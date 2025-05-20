import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put } from '@nestjs/common';
import { DepartamentService } from './departament.service';
import { StatusTypeService } from 'src/statusType/statusType.service';
import { UpdateProductSubCategoryDto } from 'src/productSubCategory/dto/updateProductSubCategory.dto';
import mongoose from 'mongoose';
import { UpdateDepartamentDto } from './dto/updateDepartament.dto';
import { CreateDepartamentDto } from './dto/createDepartament.dto';

@Controller('departament')
export class DepartamentController {
  constructor(
    private service: DepartamentService,
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

  @Post('listWithParams')
  async listWithParams(@Body() body: any){
    try {
      
      if(body.name){
        body.name = {$regex: new RegExp(body.name, 'i')};
      }
      
      return await this.service.listWithParams(body);
    } catch (error) {
      throw error;
    }
  }
  
  @Post()
  async create(@Body() body: CreateDepartamentDto, @Req() req: Request){
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

  @Put(':id')
  async update(@Param('id')  id : string, @Body() body: UpdateDepartamentDto, @Req() req: Request){
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
