import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Product } from './product.schema';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private model : Model<Product>
  ) {}

  async list(){
    return await this.model.find()
    .populate([
      {
        path: 'idStatusType',
        select: 'name color'
      },
      {
        path: 'idProductCategory',
        select: 'name color'
      },
      {
        path: 'idProductSubCategory',
        select: 'name color'
      },
      {
        path: 'idProductType',
        select: 'name color'
      },
      {
        path: 'idBrand',
        select: 'name color'
      },
      {
        path: 'idCompany',
        select: 'name color'
      }
    ]);
  }

  async listWithParams(body : object){
    return await this.model.find(body);
  }

  async listWithParamsPopulate(body : object){
    return await this.model.find(body)
    .populate([
      {
          path: 'idStatusType',
          select: 'name color'
      },
      {
        path: 'idProductCategory',
        select: 'name color'
      },
      {
        path: 'idProductSubCategory',
        select: 'name color'
      },
      {
        path: 'idProductType',
        select: 'name color'
      },
      {
        path: 'idBrand',
        select: 'name color'
      },
      {
        path: 'idCompany',
        select: 'name color'
      }
    ]);
  }

  async listWithParamsAsync(body : object){
    return await this.model.find(body);
  }

  async listWithParamsAsyncPopulate2(body : object){
    return await this.model.find(body).populate([
      {
          path: 'idStatusType',
          select: 'name color'
      },
      {
        path: 'idProductCategory',
        select: 'name color'
      },
      {
        path: 'idProductSubCategory',
        select: 'name color'
      },
      {
        path: 'idProductType',
        select: 'name color'
      },
      {
        path: 'idBrand',
        select: 'name color'
      },
      {
        path: 'idCompany',
        select: 'name color'
      }
    ]);
  }

  async listWithParamsAsyncPopulate(skip: number = 0, limit: any = null, data = {},orderProducts = "0") {
    let order = {};
    if(!orderProducts || orderProducts == "0"){ order = { createdAt: 'desc' }};
    if(orderProducts == "-1"){ order = { unitValue: 'desc' }};
    if(orderProducts == "1"){ order = { unitValue: 'asc' }};
    // console.log("order",order);  
    const totalRecordsQuery = this.model.countDocuments(data);
    const paginatedResultsQuery = this.model.find(data).populate([
      {
        path: 'idStatusType',
        select: 'name color'
      },
      {
        path: 'idProductCategory',
        select: 'name color'
      },
      {
        path: 'idProductSubCategory',
        select: 'name color'
      },
      {
        path: 'idProductType',
        select: 'name color'
      },
      {
        path: 'idBrand',
        select: 'name color'
      },
      {
        path: 'idCompany',
        select: 'name color'
      }
    ])        
    .skip(skip)
    .limit(limit)
    .sort(order)
    .lean()
    .exec();

    return Promise.all([totalRecordsQuery, paginatedResultsQuery])
      .then(([totalRecords, paginatedResults]) => {
        return {
          total: totalRecords,
          results: paginatedResults
        };
    });
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
    return await this.model.findById(id)
    .populate([
      {
        path: 'idStatusType',
        select: 'name color'
      },
      {
        path: 'idProductCategory',
        select: 'name color'
      },
      {
        path: 'idProductSubCategory',
        select: 'name color'
      },
      {
        path: 'idProductType',
        select: 'name color'
      },
      {
        path: 'idBrand',
        select: 'name color'
      },
      {
        path: 'idCompany',
        select: 'businessName commercialName'
      }
     ]);
  }
  
  async create(body : CreateProductDto){
    const newRegister = new this.model(body);
    return newRegister.save();
  }

  async update(id: string, body : UpdateProductDto){
    return await this.model.findByIdAndUpdate(id, body, {new:true});
  }
  
  async updateSinDto(id: string, body : any){
    return await this.model.findByIdAndUpdate(id, body, {new:true});
  }

  async delete(id: string){
    return await this.model.findByIdAndDelete(id);
  }
}