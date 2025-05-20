import {IsArray, IsDate, IsDateString, IsMongoId, IsNumber, IsObject, IsOptional, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';
import { CreateOrderDetailDto } from './createOrderDetail.dto';

export class UpdateOrderDto{
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  internalCode?: string;

  @IsString()
  @IsOptional()
  name?: String;

  @IsString()
  @IsOptional()
  description?: String;

  @IsString()
  @IsOptional()
  serie?: string;

  @IsNumber()
  @IsOptional()
  correlative?: number;

  @IsArray()
  @IsOptional()
  detail?: CreateOrderDetailDto[];

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsNumber()
  @IsOptional()
  commission?: number;

  @IsNumber()
  @IsOptional()
  charge?: number;

  @IsNumber()
  @IsOptional()
  tax?: number;

  @IsNumber()
  @IsOptional()
  subTotal?: number;

  @IsNumber()
  @IsOptional()
  total?: number;

  @IsMongoId()
  @IsOptional()
  idCountry?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idUser?: Types.ObjectId;

  @IsDateString()
  @IsOptional()
  issueDate?: Date;

  @IsDateString()
  @IsOptional()
  expirationDate?: Date;

  @IsMongoId()
  @IsOptional()
  idCurrencyType?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idDeliveryMethod?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idPaymentMethod?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idStatusType?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  idStatusPay?: Types.ObjectId;
}