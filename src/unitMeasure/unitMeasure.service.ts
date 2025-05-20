import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { UnitMeasure } from './unitMeasure.schema';
import { CreateUnitMeasureDto } from './dto/createUnitMeasure.dto';
import { UpdateUnitMeasureDto } from './dto/updateUnitMeasure.dto';


@Injectable()
export class UnitMeasureService {
  constructor(
    @InjectModel(UnitMeasure.name) private model : Model<UnitMeasure>
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
  
  async create(body : CreateUnitMeasureDto){
    const newRegister = new this.model(body);
    return newRegister.save();
  }

  async update(id: string, body : UpdateUnitMeasureDto){
    return await this.model.findByIdAndUpdate(id, body, {new:true});
  }

  async delete(id: string){
    return await this.model.findByIdAndDelete(id);
  }
}