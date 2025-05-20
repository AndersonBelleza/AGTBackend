import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { DocumentSerie } from './documentSerie.schema';
import { CreateDocumentSerieDto } from './dto/createDocumentSerie.dto';
import { UpdateDocumentSerieDto } from './dto/updateDocumentSerie.dto';

@Injectable()
export class DocumentSerieService {
  constructor(
    @InjectModel(DocumentSerie.name) private model : Model<DocumentSerie>
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
  
  async create(body : CreateDocumentSerieDto){
    const newRegister = new this.model(body);
    return newRegister.save();
  }

  async update(id: string, body : UpdateDocumentSerieDto){
    return await this.model.findByIdAndUpdate(id, body, {new:true});
  }

  async updateCorrelative(id: string, correlative : Number){
    return await this.model.findByIdAndUpdate(id, {"correlative": correlative}, {new:true});
  }

  async delete(id: string){
    return await this.model.findByIdAndDelete(id);
  }
}