import {IsDate, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';

export class UpdateDocumentSerieDto{
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  internalCode?: string;

  @IsString()
  @IsOptional()
  serie?: String;

  @IsNumber()
  @IsOptional()
  correlative: Number;

  @IsString()
  @IsOptional()
  description?: String;

  @IsMongoId()
  @IsOptional()
  idStatusType?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idDocumentType?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idCompany?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idSite?: Types.ObjectId;
}