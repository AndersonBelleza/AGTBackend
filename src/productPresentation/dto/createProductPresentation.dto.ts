import {IsArray, IsDate, IsMongoId, isNotEmpty, IsNotEmpty, IsNumber, IsNumberString, IsObject, IsOptional, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';

export class CreateProductPresentationDto{
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
  StockMaxUser?: number;

  @IsNumber()
  @IsOptional()
  unitValue?: number;

  @IsNumber()
  @IsOptional()
  unitPrice?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsNumberString()
  @IsOptional()
  typeDiscount?: String;

  @IsMongoId()
  @IsOptional()
  idStatusType?: Types.ObjectId;

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