import {IsDate, IsMongoId, IsNotEmpty, IsObject, IsOptional, isString, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';

export class CreateCurrencyTypeDto{
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

  @IsString()
  @IsOptional()
  proccess: string;
}