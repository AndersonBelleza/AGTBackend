import {IsDate, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';

export class UpdateCodePromotionalDto{
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  internalCode?: string;

  @IsString()
  @IsOptional()
  name?: String;

  @IsNumber()
  @IsOptional()
  value?: String;

  @IsNumber()
  @IsOptional()
  limit?: Number;

  @IsString()
  @IsOptional()
  description?: String;

  // @IsString()
  // @IsOptional()
  // type?: String;

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