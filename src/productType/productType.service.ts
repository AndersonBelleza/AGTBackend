import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { ProductType } from './productType.schema';
import { CreateProductTypeDto } from './dto/createProductType.dto';
import { UpdateProductTypeDto } from './dto/updateProductType.dto';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectModel(ProductType.name) private model : Model<ProductType>
  ) {}

  async list(){
    return await this.model.find();
  }

  async listWithParams(body : object){
    return await this.model.find(body);
  }

  async listWithParamsPopulate(body : object){
    return await this.model.find(body);
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
  
  async create(body : CreateProductTypeDto){
    const newRegister = new this.model(body);
    return newRegister.save();
  }

  async update(id: string, body : UpdateProductTypeDto){
    return await this.model.findByIdAndUpdate(id, body, {new:true});
  }

  async delete(id: string){
    return await this.model.findByIdAndDelete(id);
  }
}