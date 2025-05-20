import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { UserType } from './userType.schema';
import { CreateUserTypeDto } from './dto/createUserType.dto';
import { UpdateUserTypeModDto } from './dto/updateUserType.dto';

@Injectable()
export class UserTypeService {
  constructor(
    @InjectModel(UserType.name) private model : Model<UserType>
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
  
  async create(body : CreateUserTypeDto){
    const newRegister = new this.model(body);
    return newRegister.save();
  }

  async update(id: string, body : UpdateUserTypeModDto){
    return await this.model.findByIdAndUpdate(id, body, {new:true});
  }

  async delete(id: string){
    return await this.model.findByIdAndDelete(id);
  }
}