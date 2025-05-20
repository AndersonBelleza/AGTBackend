import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { UserSchema, User } from './user.schema';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private model : Model<User>
  ) {}

  async list(){
    return await this.model.find();
  }

  async listWithParams(body : object){
    return await this.model.find(body);
  }

  async listWithParamsPopulate(body : object){
    return await this.model.find(body).populate([
      {
        path : 'idPerson',
        select : 'names document paternalSurname maternalSurname'
      },
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
      {
        path : 'idStatusType'
      }
    ]);
  }
  async listWithParamsPopulateAsync(body : object){
    return await this.model.find(body).populate([
      {
        path : 'idPerson',
        select : 'names document paternalSurname maternalSurname'
      },
      {
        path : 'idStatusType'
      },
      {
        path : 'idUserType'
      }
    ]);
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

  async findOneWithParamsLogin(body : object){ 
    return await this.model.findOne(body)
    .populate([
      {
        path: 'idUserType',
      },
    ]);
  }

  async findOneWithParamsPopulate(body : object){ 
    return await this.model.findOne(body);
  }

  async findId(id: string){
    return await this.model.findById(id);
  }

  async findIdPopulate(id: string){
    return (await this.model.findById(id)).populate([
      {
        path : 'idPerson'
      },
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
      {
        path : 'idStatusType'
      }
    ]);
  }
  
  async findIdPopulateV2(id: string){
    return (await this.model.findById(id)).populate([
      {
        path : 'idPerson',
        populate : [
          {
            path : "documentTypeId"
          },
        ],
      },
      {
        path : 'idStatusType'
      },
      {
        path : 'favorites.idProductSite',
        populate : [
          {
            path : "idProductCategory"
          },
          {
            path : "idProductSubCategory"
          },
          {
            path : "idUnitMeasure"
          }
        ],
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
    ]);
  }
  
  async create(body : CreateUserDto){
    const newRegister = new this.model(body);
    return newRegister.save();
  }

  async addSite(id: string, data: any) {
    const result = await this.model.findByIdAndUpdate(
      id,
      { $push: { userSite: data } },
      { new: true }
    );

    return result;
  }

  async update(id: string, body : UpdateUserDto){
    return await this.model.findByIdAndUpdate(id, body, {new:true});
  }

  async delete(id: string){
    return await this.model.findByIdAndDelete(id);
  }
}