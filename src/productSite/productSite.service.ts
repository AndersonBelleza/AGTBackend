import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { ProductSite } from './productSite.schema';
import { CreateProductSiteDto } from './dto/createProductSite.dto';
import { UpdateProductSiteDto } from './dto/updateProductSite.dto';

@Injectable()
export class ProductSiteService {
  constructor(
    @InjectModel(ProductSite.name) private model : Model<ProductSite>
  ) {}

  async list(){
    return await this.model.find();
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
        select: 'name color businessName'
      },
      {
        path: 'idCurrencyType',
        select: 'name color symbol'
      }
    ])  
    .lean()
    .exec();;
  }

  async listWithParamsAsync(body : object){
    return await this.model.find(body);
  }

  // se usa para buscar producto en el navbar, revisar el controller
  async listWithParamsAsync2(skip: number = 0, limit: any = null, data = {}) {
    // const totalRecordsQuery = this.model.countDocuments(data);
    const paginatedResultsQuery =  this.model.find(data)
    .populate([
      {
        path: 'idBrand',
        select: 'name color'
      },
    ])  
    .skip(skip)
    .limit(limit)
    .sort({ name: 'asc' })
    .lean()
    .exec();
    return paginatedResultsQuery;
    // return Promise.all([totalRecordsQuery, paginatedResultsQuery])
    //   .then(([totalRecords, paginatedResults]) => {
    //     return {
    //       total: totalRecords,
    //       results: paginatedResults
    //     };
    // });
  }
  
  async listWithParamsAsyncPopulate(skip: number = 0, limit: any = null, data = {}, orderProducts = "0") {
    let order = {};
    if(!orderProducts || orderProducts == "0"){ order = { createdAt: 'desc' }};
    if(orderProducts == "-1"){ order = { unitValue: 'desc' }};
    if(orderProducts == "1"){ order = { unitValue: 'asc' }};
    const totalRecordsQuery = this.model.countDocuments(data);
    const paginatedResultsQuery =  this.model.find(data).populate([
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
        select: 'name color businessName'
      },
      {
        path: 'idCurrencyType',
        select: 'name color symbol'
      },
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
    return await this.model.findById(id).populate([
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
        select: 'name color businessName'
      },
      {
        path: 'idCurrencyType',
        select: 'name color symbol'
      },
      {
        path: 'idUnitMeasure',
        select: 'name color'
      },
    ]);
  }
  
  async create(body : CreateProductSiteDto){
    const newRegister = new this.model(body);
    return newRegister.save();
  }

  async update(id: string, body : UpdateProductSiteDto){
    return await this.model.findByIdAndUpdate(id, body, {new:true});
  }

  async delete(id: string){
    return await this.model.findByIdAndDelete(id);
  }
  
  async listWithParamsAsyncPopulateAsync(skip: number = 0, limit: any = null, data = {},orderProducts = "0") {
    let order = {};
    if(!orderProducts || orderProducts == "0"){ order = { createdAt: 'desc' }};
    if(orderProducts == "-1"){ order = { unitValue: 'desc' }};
    if(orderProducts == "1"){ order = { unitValue: 'asc' }};
    const totalRecordsQuery = this.model.countDocuments(data);
    const paginatedResultsQuery = this.model.find(data).populate([
      {
          path: 'idStatusType',
          select: 'name color'
      },
      {
          path: 'idSite',
          select: 'name'
      },
      {
        path : "idProductCategory"
      },
      {
        path : "idProductSubCategory"
      },
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

  async updateSinDto(id: string, body : any){
    return await this.model.findByIdAndUpdate(id, body, {new:true});
  }
}