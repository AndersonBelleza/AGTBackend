import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CurrencyType } from './currencyType.schema';
import { CreateCurrencyTypeDto } from './dto/createCurrencyType.dto';
import { UpdateCurrencyTypeDto } from './dto/updateCurrencyType.dto';

@Injectable()
export class CurrencyTypeService {
  constructor(
    @InjectModel(CurrencyType.name) private model : Model<CurrencyType>
  ) {}

  async list(){
    return await this.model.find()
    .populate([
      {
          path: 'idStatusType',
          select: 'name color'
      }
    ]);
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
  
  async create(body : CreateCurrencyTypeDto){
    const newRegister = new this.model(body);
    return newRegister.save();
  }

  async update(id: string, body : UpdateCurrencyTypeDto){
    return await this.model.findByIdAndUpdate(id, body, {new:true});
  }

  async delete(id: string){
    return await this.model.findByIdAndDelete(id);
  }
}