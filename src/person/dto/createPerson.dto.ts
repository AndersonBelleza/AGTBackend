import {IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';

export class CreatePersonDto{
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  internalCode?: string;

  @IsString()
  @IsNotEmpty()
  names: string;
  
  @IsString()
  @IsOptional()
  paternalSurname?: string;
  
  @IsString()
  @IsOptional()
  maternalSurname?: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsString()
  @IsOptional()
  maritalStatus?: string;

  @IsString()
  @IsOptional()
  sex?: string;

  @IsDate()
  @IsOptional()
  birthdate?: Date;

  @IsMongoId()
  @IsOptional()
  idStatusType?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  documentTypeId?: Types.ObjectId;
}