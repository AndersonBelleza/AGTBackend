import {IsArray, IsDate, IsMongoId, isNotEmpty, IsNotEmpty, IsNumber, IsNumberString, IsObject, IsOptional, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';

export class CreateProductDto{
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  internalCode?: string;

  @IsString()
  @IsNotEmpty()
  name: String;

  @IsString()
  @IsOptional()
  description?: String;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsNumber()
  @IsOptional()
  stockMin?: number;

  @IsNumber()
  @IsOptional()
  unitValue?: number;

  @IsNumber()
  @IsOptional()
  unitPrice?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsNumber()
  @IsOptional()
  correlative?: number;

  @IsNumberString()
  @IsOptional()
  typeDiscount?: String;

  @IsMongoId()
  @IsOptional()
  idStatusType?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idDocumentSerie?: Types.ObjectId;
  
  @IsMongoId()
  @IsOptional()
  idCurrencyType?: Types.ObjectId;
  
  @IsMongoId()
  @IsOptional()
  idProductType?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idProductCategory?: Types.ObjectId;
  
  @IsMongoId()
  @IsOptional()
  idProductSubCategory?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idBrand?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idCompany?: Types.ObjectId;  
  
  @IsMongoId()
  @IsOptional()
  idUnitMeasure?: Types.ObjectId;  

  // @IsMongoId()
  // @IsOptional()
  // idSite: Types.ObjectId; 
  @IsArray()
  @IsOptional()
  images?: [{}];

  @IsArray()
  @IsOptional()
  warrantyPolicy?: [{}];

  @IsObject()
  @IsOptional()
  specs?: {};

}