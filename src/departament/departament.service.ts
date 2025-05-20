import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Departament } from './departament.schema';
import { CreateTemplateModDto } from 'src/templateMod/dto/createTemplateMod.dto';
import { UpdateTemplateModDto } from 'src/templateMod/dto/updateTemplateMod.dto';


@Injectable()
export class DepartamentService {
  constructor(
    @InjectModel(Departament.name) private model : Model<Departament>
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
  
  async create(body : CreateTemplateModDto){
    const newRegister = new this.model(body);
    return newRegister.save();
  }

  async update(id: string, body : UpdateTemplateModDto){
    return await this.model.findByIdAndUpdate(id, body, {new:true});
  }

  async delete(id: string){
    return await this.model.findByIdAndDelete(id);
  }
}