import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Site, SiteSchema } from './site.schema';
import { CreateSiteDto } from './dto/createSite.dto';
import { UpdateSiteDto } from './dto/updateSite.dto';

@Injectable()
export class SiteService {
  constructor(
    @InjectModel(Site.name) private model : Model<Site>
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
    return (await this.model.findOne(body)).populate([
      {
        path : 'idDistrict',
        select: 'name',
        populate : ([
          {
            path : 'idProvince',
            select: 'name',
            populate : ([
              {
                path : 'idDepartament',
                select: 'name',
              }
            ])
          }
        ])
      },
    ]);
  }

  async findId(id: string){
    return await this.model.findById(id);
  }

  async findIdPopulate(id: string){
    return await this.model.findById(id);
  }
  
  async create(body : CreateSiteDto){
    const newRegister = new this.model(body);
    return newRegister.save();
  }

  async update(id: string, body : any){
    return await this.model.findByIdAndUpdate(id, body, {new:true});
  }

  async delete(id: string){
    return await this.model.findByIdAndDelete(id);
  }
}