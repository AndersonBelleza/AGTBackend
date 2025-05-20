import {IsDate, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';

export class CreateProductSubCategoryDto{
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  internalCode?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
  
  @IsMongoId()
  @IsNotEmpty()
  idProductCategory: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idStatusType: Types.ObjectId;
}