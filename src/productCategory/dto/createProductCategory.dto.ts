import {IsDate, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';

export class CreateProductCategoryDto{
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
  @IsNotEmpty()
  order: String;

  @IsString()
  @IsOptional()
  description?: String;

  @IsMongoId()
  @IsOptional()
  idStatusType?: Types.ObjectId;
}