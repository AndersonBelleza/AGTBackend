import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { ProductPresentation } from './productPresentation.schema';
import { CreateProductPresentationDto } from './dto/createProductPresentation.dto';
import { UpdateProductPresentationDto } from './dto/updateProductPresentation.dto';

@Injectable()
export class ProductPresentationService {
  constructor(
    @InjectModel(ProductPresentation.name) private model : Model<ProductPresentation>
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
    ]);
  }

  async listWithParamsAsyncPopulate(skip: number = 0, limit: any = null, data = {},orderProducts = "0") {
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
        path: 'idProductSite',
        populate : [
          {
            path : "idProduct",
            populate : [
              {
                path : "idProductCategory"
              }
            ]
          },
          {
            path : "idSite"
          }
        ]
      },
      {
        path: 'subPresentation',
        populate : [
          {
            path : "idStatusType",
          }
        ]
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
    return await this.model.findOne(body)
    .populate([
      {
        path: 'idStatusType',
        select: 'name color'
      },
      {
        path: 'idProductSite',
        populate : ([
          {
            path: 'idCurrencyType',
            select: 'name color symbol'
          },
          {
            path: 'idUnitMeasure',
          },
        ]),
      },
      {
        path: 'subPresentation.idStatusType',
      },
    ]);
  }

  async findId(id: string){
    // console.log("id m,", id);
    
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
        path: 'idProductSite',
        populate : ([
          {
            path: 'idCurrencyType',
            select: 'name color symbol'
          },
          {
            path: 'idUnitMeasure',
          },
        ]),
      },
      {
        path: 'subPresentation.idStatusType',
      },
     ]);
  }
  
  async create(body : CreateProductPresentationDto){
    const newRegister = new this.model(body);
    return newRegister.save();
  }

  async update(id: string, body : UpdateProductPresentationDto){
    return await this.model.findByIdAndUpdate(id, body, {new:true});
  }
  
  async updateSinDto(id: string, body : any){
    return await this.model.findByIdAndUpdate(id, body, {new:true});
  }

  async delete(id: string){
    return await this.model.findByIdAndDelete(id);
  }

  async deleteImg(id: string, index: number) {
    const data = await this.model.findById(id);
    if (!data) return 'No encontrado';
    data.images.splice(index, 1);
    return await data.save();
  }

  
}