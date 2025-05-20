import {IsDate, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';

export class CreateDistrictDto{
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
  idProvince: Types.ObjectId;
}