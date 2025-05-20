import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put } from '@nestjs/common';
import { UnitMeasureService } from './unitMeasure.service';
import { StatusTypeService } from 'src/statusType/statusType.service';
import { CreateUnitMeasureDto } from './dto/createUnitMeasure.dto';
import mongoose from 'mongoose';
import { UpdateUnitMeasureDto } from './dto/updateUnitMeasure.dto';

@Controller('unitMeasure')
export class UnitMeasureController {
  constructor(
    private service: UnitMeasureService,
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

  @Put(':id')
  async update(@Param('id')  id : string, @Body() body: UpdateUnitMeasureDto, @Req() req: Request){
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
