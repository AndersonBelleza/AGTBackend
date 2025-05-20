import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { StatusType } from './statusType.schema';
import { UpdateStatusTypeDto } from './dto/updateStatusType.dto';
import { CreateStatusTypeDto } from './dto/createStatusType.dto';

@Injectable()
export class StatusTypeService {
  constructor(
    @InjectModel(StatusType.name) private model : Model<StatusType>
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

  async listWithParamsAsyncPopulate(skip: number = 0, limit: any = null, data = {}) {
    const totalRecordsQuery = this.model.countDocuments(data);
    const paginatedResultsQuery = this.model.find(data)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: 'desc'})
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
    return await this.model.findById(id);
  }
  
  async create(body : CreateStatusTypeDto){
    const newRegister = new this.model(body);
    return newRegister.save();
  }

  async update(id: string, body : UpdateStatusTypeDto){
    return await this.model.findByIdAndUpdate(id, body, {new:true});
  }

  async delete(id: string){
    return await this.model.findByIdAndDelete(id);
  }
}