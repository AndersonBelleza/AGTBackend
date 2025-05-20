import {IsDate, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';

export class CreateCodePromotionalDto{
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  internalCode?: string;

  @IsString()
  @IsNotEmpty()
  name: String;

  @IsNumber()
  @IsNotEmpty()
  value: Number;

  @IsString()
  @IsOptional()
  description?: String;

  // @IsString()
  // @IsNotEmpty()
  // type: String;

  @IsNumber()
  @IsNotEmpty()
  limit: Number;

  @IsDate()
  @IsOptional()
  expirationDate?: Date;

  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsMongoId()
  @IsOptional()
  idStatusType?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idCompany?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idSite?: Types.ObjectId;
}