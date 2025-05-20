import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { ProductSubCategory } from './productSubCategory.schema';
import { CreateProductSubCategoryDto } from './dto/createProductSubCategory.dto';
import { UpdateProductSubCategoryDto } from './dto/updateProductSubCategory.dto';

@Injectable()
export class ProductSubCategoryService {
  constructor(
    @InjectModel(ProductSubCategory.name) private model : Model<ProductSubCategory>
  ) {}

  async list(){
    return await this.model.find();
  }

  async listWithParams(body : object){
    return await this.model.find(body);
  }

  async listWithParamsPopulate(body : object){
    return await this.model.find(body).populate([
      {
          path: 'idStatusType',
          select: 'name color'
      },
      {
          path: 'idProductCategory',
          select: 'name '
      }
    ]);
  }

  async listWithParamsAsync(body : object){
    return await this.model.find(body);
  }

  async listWithParamsAsyncPopulate(body : object){
    return await this.model.find(body);
  }

  async findOneWithParams(body : object){ 
    return await this.model.findOne(body);
  }

  async findOneWithParamsPopulate(body : object){ 
    return await this.model.findOne(body);
  }

  async findId(id: string){
    return await this.model.findById(id);
  }

  async findIdPopulate(id: string){
    return await this.model.findById(id);
  }
  
  async create(body : CreateProductSubCategoryDto){    
    const newRegister = new this.model(body);
    return newRegister.save();
  }

  async update(id: string, body : UpdateProductSubCategoryDto){
    return await this.model.findByIdAndUpdate(id, body, {new:true});
  }

  async delete(id: string){
    return await this.model.findByIdAndDelete(id);
  }
}