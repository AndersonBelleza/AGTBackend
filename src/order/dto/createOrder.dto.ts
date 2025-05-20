import {IsArray, IsDate, IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';
import { CreateOrderDetailDto } from './createOrderDetail.dto';

export class CreateOrderDto{
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

  @IsString()
  @IsNotEmpty()
  serie: string;

  @IsNumber()
  @IsNotEmpty()
  correlative: Number;

  @IsNotEmpty()
  @IsArray()
  detail: CreateOrderDetailDto[];

  @IsNumber()
  @IsNotEmpty()
  discount?: number;

  @IsNumber()
  @IsNotEmpty()
  commission?: number;

  @IsNumber()
  @IsNotEmpty()
  charge?: number;

  @IsNumber()
  @IsNotEmpty()
  tax?: number;

  @IsNumber()
  @IsNotEmpty()
  subTotal: number;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsMongoId()
  @IsOptional()
  idCountry: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idUser: Types.ObjectId;

  @IsDateString()
  @IsOptional()
  issueDate?: Date;

  @IsDateString()
  @IsOptional()
  expirationDate?: Date;

  @IsMongoId()
  @IsOptional()
  idCurrencyType: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idDeliveryMethod: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idPaymentMethod: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idStatusType?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idStatusPay?: Types.ObjectId;

  @IsOptional()
  idDocumentSerie?: any;
}