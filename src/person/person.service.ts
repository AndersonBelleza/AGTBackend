import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Person } from './person.schema';
import { CreatePersonDto } from './dto/createPerson.dto';
import { UpdatePersonDto } from './dto/updatePerson.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectModel(Person.name) private model : Model<Person>
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

  async listWithParamsAsync(body: any, skip: number = 0, limit: any = null) {
    const totalRecordsQuery = this.model.countDocuments(body);
    const paginatedResultsQuery = this.model.find(body)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: 'desc' })
    .lean()
    .exec();
    return Promise.all([totalRecordsQuery, paginatedResultsQuery]).then(
      ([totalRecords, paginatedResults]) => {
        return {
          total: totalRecords,
          results: paginatedResults,
        };
      },
    );
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
  
  async create(body : CreatePersonDto){
    const newRegister = new this.model(body);
    return newRegister.save();
  }

  async update(id: string, body : UpdatePersonDto){
    return await this.model.findByIdAndUpdate(id, body, {new:true});
  }

  async delete(id: string){
    return await this.model.findByIdAndDelete(id);
  }
}