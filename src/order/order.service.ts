import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Order } from './order.schema';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private model : Model<Order>
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

  async listWithPopulateBestProduct(body : object){
    return await this.model.find(body)
    .populate([
      {
        path: 'detail.idProductSite',
      },
      {
        path: 'detail.idProductPresentation',
      },
      {
        path: 'detail.idProductSubPresentation',
      }
    ]);
  }

  async productDeliver(body: object) {
    return await this.model.aggregate([
      {
        $match: body,
      },
      {
        $lookup: {
          from: "statusType",
          localField: "idStatusType",
          foreignField: "_id",
          as: "statusTypeInfo"
        },
      },
      {
        $unwind: "$statusTypeInfo",
      },
      {
        $match: {
          "statusTypeInfo.name": {
            $in: ["En proceso", "En tránsito", "Listo para recojo", "Retrasado"],
          },
        },
      },
      {
        $project: {
          statusTypeInfo: 0,
        },
      },
    ]);
  }
  

  async listWithParamsAsyncPopulate(body : object){
    return await this.model.find(body)
    .populate([
      {
        path: 'idStatusType',
        select: 'name color'
      },
      {
        path: 'idDeliveryMethod',
        select: 'name color'
      },
      {
        path: 'idPaymentMethod',
        select: 'name color'
      },
      {
        path: 'idStatusPay',
        select: 'name color'
      },
      {
        path: 'idCurrencyType',
        select: 'name color symbol'
      },
      {
        path: 'detail.idProductPresentation',
      },
    ]);
  }

  async listWithParamsAsyncPopulate2(body : object){
    return await this.model.find(body)
    .populate([
      {
        path: 'idStatusType',
        select: 'name color'
      },
      {
        path: 'idDeliveryMethod',
        select: 'name color'
      },
      {
        path: 'idPaymentMethod',
        select: 'name color'
      },
      {
        path: 'idStatusPay',
        select: 'name color'
      },
      {
        path: 'idCurrencyType',
        select: 'name color symbol'
      },
      {
        path: 'detail.idProductPresentation',
      },
    ])
    .sort({ createdAt: 'asc' })
    .exec();

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
        path: 'idClientUser',
        select: 'name color telephone email address',
        populate : ([
          {
            path : 'idPerson',
            select : 'names paternalSurname maternalSurname'
          },
          {
            path : 'addresses.idDepartament',
          },
          {
            path : 'addresses.idDistrict',
          },
          {
            path : 'addresses.idProvince',
          }
        ])
      },
      {
        path: 'idStatusType',
        select: 'name color'
      },
      {
        path: 'idDeliveryMethod',
        select: 'name color'
      },
      {
        path: 'idPaymentMethod',
        select: 'name color'
      },
      {
        path: 'idStatusPay',
        select: 'name color'
      },
      {
        path : 'idDistrict',
        populate : ([
          {
            path : 'idProvince',
            populate : ([
              {
                path : 'idDepartament',
              }
            ])
          }
        ])
      },
      {
        path: 'idCurrencyType',
        select: 'name color symbol'
      },
    ])
    .lean()
    .exec();
  }

  async findIdPopulateDetailOrder(id: string){
    return await this.model.findById(id)
    .populate([
      {
        path: 'idClientUser',
        select: 'name color telephone email address',
        populate : ([
          {
            path : 'idPerson',
            select : 'names paternalSurname maternalSurname'
          },
          {
            path : 'addresses.idDepartament',
          },
          {
            path : 'addresses.idDistrict',
          },
          {
            path : 'addresses.idProvince',
          }
        ])
      },
      {
        path: 'idStatusType',
        select: 'name color'
      },
      {
        path: 'idDeliveryMethod',
        select: 'name color'
      },
      {
        path: 'idPaymentMethod',
        select: 'name color'
      },
      {
        path: 'idStatusPay',
        select: 'name color'
      },
      {
        path : 'idDistrict',
        populate : ([
          {
            path : 'idProvince',
            populate : ([
              {
                path : 'idDepartament',
              }
            ])
          }
        ])
      },
      {
        path: 'idCurrencyType',
        select: 'name color symbol'
      },
      {
        path: 'detail.idProductSite',
      },
      {
        path: 'detail.idProductPresentation',
      },
      {
        path: 'detail.idProductSubPresentation',
      }
    ])
    .lean()
    .exec();
  }
  
  async create(body : CreateOrderDto){
    const newRegister = new this.model(body);
    return newRegister.save();
  }

  async update(id: string, body : UpdateOrderDto){
    return await this.model.findByIdAndUpdate(id, body, {new:true});
  }

  async delete(id: string){
    return await this.model.findByIdAndDelete(id);
  }
}