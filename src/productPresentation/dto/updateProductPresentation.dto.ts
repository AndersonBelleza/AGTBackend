import {IsArray, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsNumberString, IsObject, IsOptional, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';

export class UpdateProductPresentationDto{
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

  @IsNumber()
  @IsOptional()
  StockMaxUser?: number;

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