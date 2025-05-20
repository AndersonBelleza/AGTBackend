import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put } from '@nestjs/common';
import { ProductSubCategoryService } from './productSubCategory.service';
import { StatusTypeService } from 'src/statusType/statusType.service';
import { CreateProductSubCategoryDto } from './dto/createProductSubCategory.dto';
import { UpdateProductSubCategoryDto } from './dto/updateProductSubCategory.dto';
import { ProductCategoryService } from 'src/productCategory/productCategory.service';
import mongoose from 'mongoose';

@Controller('productSubCategory')
export class ProductSubCategoryController {
  constructor(
    private service: ProductSubCategoryService,
    private statusTypeService: StatusTypeService,
    private productCategoryService: ProductCategoryService,
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
  async create(@Body() body : CreateProductSubCategoryDto, @Req() req: Request){
    try {
      if(!body.idStatusType){
        // Cambiar proccess si es necesario, por ahora lo dejo con Default
        const statusType = await this.statusTypeService.findOneWithParams({name:"Activo", proccess: "Default"});
        if(!statusType) throw 'Tipo de Estado Activo no encontrado..!';
        body.idStatusType = statusType?._id;
      }else{
        body.idStatusType = new mongoose.Types.ObjectId(body?.idStatusType);
      }
      if(!body.idProductCategory){
        // Cambiar proccess si es necesario, por ahora lo dejo con Default
        const productCategory = await this.productCategoryService.findOneWithParams({name:"Default"});
        if(!productCategory) throw new NotFoundException('Categoria de Producto Default no encontrado..!');
        body.idProductCategory = productCategory?._id;
      }else{
        body.idProductCategory = new mongoose.Types.ObjectId(body?.idProductCategory);
      }
      const response = await this.service.create(body);
      return response
    } catch (error) {
      throw error
    }
  }

  @Post('listWithParamsPopulate')
  async findWithParams(@Body() body : any, @Req() req: Request){
    try {
      if(body.idProductCategory){
        // Cambiar proccess si es necesario, por ahora lo dejo con Default
        body.idProductCategory = new mongoose.Types.ObjectId(body?.idProductCategory);

      }  
      const response =  await this.service.listWithParamsPopulate(body);
      if(!response) throw new NotFoundException('Elemento no encontrado..!');
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async update(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
    try {
      if(!body.idProductCategory){
        // Cambiar proccess si es necesario, por ahora lo dejo con Default
        const productCategory = await this.productCategoryService.findOneWithParams({name:"Default"});
        if(!productCategory) throw new NotFoundException('Categoria de Producto Default no encontrado..!');
        body.idProductCategory = productCategory?._id;
      }else{
        body.idProductCategory = new mongoose.Types.ObjectId(body?.idProductCategory);
      }
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
