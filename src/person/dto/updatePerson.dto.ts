import {IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';

export class UpdatePersonDto{
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  internalCode?: string;

  @IsString()
  @IsOptional()
  names?: string;
  
  @IsString()
  @IsOptional()
  paternalSurname?: string;
  
  @IsString()
  @IsOptional()
  maternalSurname?: string;

  @IsString()
  @IsOptional()
  document?: string;

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