import {IsArray, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsNumberString, IsObject, IsOptional, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';

export class UpdateProductDto{
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  internalCode?: string;

  @IsString()
  @IsOptional()
  name?: String;

  @IsString()
  @IsOptional()
  description?: String;

  @IsMongoId()
  @IsOptional()
  idState: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idBrand?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idProductCategory: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idProductSubCategory: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idUnitMeasure?: Types.ObjectId;  

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsNumber()
  @IsOptional()
  unitValue?: number;

  @IsNumber()
  @IsOptional()
  unitPrice?: number;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsNumber()
  @IsOptional()
  stockMin?: number;

  @IsArray()
  @IsOptional()
  images?: [];

  @IsArray()
  @IsOptional()
  warrantyPolicy?: [{}];

  @IsObject()
  @IsOptional()
  specs?: {};

  @IsNumberString()
  @IsOptional()
  typeDiscount?: String;

  @IsMongoId()
  @IsOptional()
  idStatusType?: Types.ObjectId;
}