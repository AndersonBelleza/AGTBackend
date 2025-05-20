import {IsDate, IsMongoId, IsNotEmpty, IsNumber, IsNumberString, IsObject, IsOptional, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';

export class CreateProductSiteDto{
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

  @IsMongoId()
  @IsOptional()
  idStatusType?: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  idSite: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  idProduct: Types.ObjectId;

  @IsNumber()
  @IsOptional()
  stockMin?: number;
  
  @IsNumber()
  @IsOptional()
  StockMaxUser?: number;

  @IsMongoId()
  @IsOptional()
  idUnitMeasure?: Types.ObjectId;  
}