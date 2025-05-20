import {IsDate, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';

export class CreateMetricsDto{
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
  type: String;

  @IsString()
  @IsOptional()
  description?: String;

  
  @IsMongoId()
  @IsOptional()
  idUser: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  idStatusType: Types.ObjectId;
}