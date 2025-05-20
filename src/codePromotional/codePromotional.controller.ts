import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put } from '@nestjs/common';
import { CodePromotionalService } from './codePromotional.service';
import { StatusTypeService } from 'src/statusType/statusType.service';
import { UpdateProductSubCategoryDto } from 'src/productSubCategory/dto/updateProductSubCategory.dto';
import mongoose from 'mongoose';

@Controller('codePromotional')
export class CodePromotionalController {
  constructor(
    private service: CodePromotionalService,
    private statusTypeService: StatusTypeService,
  ){}

  @Get()
  async list(){
    try {
      return await this.service.listWithParamsPopulate({});
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
  @Get('verifyCode/:code')
  async verifyCode(@Param('code') code:string){
    try {
      const response =  await this.service.findOneWithParams({code:code});
      if(!response) throw new NotFoundException('Elemento no encontrado..!');
      const utcTime = new Date().toISOString();
      const expirationDate = new Date(response?.expirationDate).toISOString();
      console.log(utcTime, " - " ,expirationDate);
      if(response?.limit < 1){
        return {message :"El codigo de promoción se ha agotado"}
      }else if(utcTime > expirationDate){
        return {message :"El codigo de promoción ha expirado"}
      }
      console.log(utcTime); // Ejemplo: "2024-12-23T14:30:00.000Z

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

      if(body.idCompany){
        body.idCompany = new mongoose.Types.ObjectId(body.idCompany)
      }
      if(body.idSite){
        body.idSite = new mongoose.Types.ObjectId(body.idSite)
      }
      if(body.title){
        body.name = body.title;
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
