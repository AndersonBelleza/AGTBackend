import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { TemplateMod } from './templateMod.schema';
import { CreateTemplateModDto } from './dto/createTemplateMod.dto';
import { UpdateTemplateModDto } from './dto/updateTemplateMod.dto';

@Injectable()
export class TemplateModService {
  constructor(
    @InjectModel(TemplateMod.name) private model : Model<TemplateMod>
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