import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, InternalServerErrorException } from '@nestjs/common';
import { ProductCategoryService } from './productCategory.service';
import { StatusTypeService } from 'src/statusType/statusType.service';
import { CreateProductCategoryDto } from './dto/createProductCategory.dto';
import { UpdateProductCategoryDto } from './dto/updateProductCategory.dto';
import mongoose from 'mongoose';
import { ProductSiteService } from 'src/productSite/productSite.service';

@Controller('productCategory')
export class ProductCategoryController {
  constructor(
    private service: ProductCategoryService,
    private productSiteService: ProductSiteService,
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
  async create(@Body() body: CreateProductCategoryDto, @Req() req: Request){
    try {
      if(!body.idStatusType){
        const statusType = await this.statusTypeService.findOneWithParams({ name:"Activo", proccess: "ProductCategory" });
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
  async update(@Param('id')  id : string, @Body() body: UpdateProductCategoryDto, @Req() req: Request){
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

  @Post('categoryListStore')
  async productByCategory(@Body() body: any, @Req() req: Request) {
    try {

      let limitCategory = 6;
      let categorys = [];
      const statusType = await this.statusTypeService.findOneWithParams({name:"Activo", proccess: "ProductCategory"});
      const statusTypepRODUCT = await this.statusTypeService.findOneWithParams({name:"Publicado", proccess: "Product"});
      if(!statusTypepRODUCT) throw ("El estado Publicado del proccess Product no existe")
      const statusTypepRODUCT2 = await this.statusTypeService.findOneWithParams({name:"Agotado", proccess: "Product"});
      if(!statusTypepRODUCT2) throw ("El estado Agotado del proccess Product no existe")
      // console.log("statusType ,",statusType);
      // console.log("statusTypepRODUCT ,",statusTypepRODUCT);
      // console.log("=============================="); 
      
      for (let i = 0; i < limitCategory ; i++) {
        let categorySelected = await this.service.findOneWithParams({ 
          order : i.toString(),
          $or: [
            { idStatusType: statusType._id },
            { idStatusType: statusType._id?.toString() }
          ]
        });
        // console.log("categorySelected",categorySelected); 
        if(categorySelected){
          // console.log("categorySelected?.name, ",categorySelected?.name);
          
          const products = await this.productSiteService.listWithParamsAsyncPopulate(0, 15, 
            {
              idProductCategory : categorySelected._id, 
              "$or" : [
                { idStatusType: statusTypepRODUCT?._id },
                { idStatusType: statusTypepRODUCT?._id.toString()},
                { idStatusType: statusTypepRODUCT2?._id },
                { idStatusType: statusTypepRODUCT2?._id.toString()},
              ]
            });
          // console.log("products2 ",products);
          if(products && products.results.length > 0){
            categorys.push({
              idCategory : categorySelected._id,
              name : categorySelected.name,
              icon : categorySelected.icon,
              products : []
            });
          }
        }
      }
      return categorys;

    } catch (error) {
      console.log("errorCateogryLList",error);
      throw new InternalServerErrorException(error);
    }
  }
}
