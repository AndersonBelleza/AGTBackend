import {IsDate, IsMongoId, IsNotEmpty, IsNumber, IsNumberString, IsObject, IsOptional, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';

export class UpdateProductSiteDto{
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
  idStatusType?: Types.ObjectId;

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
  stock: number;

  @IsMongoId()
  @IsOptional()
  idSite?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idProduct?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idUnitMeasure?: Types.ObjectId;  

  @IsNumberString()
  @IsOptional()
  typeDiscount?: String;

  @IsNumber()
  @IsOptional()
  stockMin?: number;
  
  @IsNumber()
  @IsOptional()
  StockMaxUser?: number;
}