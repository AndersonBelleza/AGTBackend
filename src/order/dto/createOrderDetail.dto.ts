import {IsArray, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString} from 'class-validator'
import { ObjectId, Types } from 'mongoose';
import { OrderDetail } from '../orderDetail.schema';

export class CreateOrderDetailDto{
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  internalCode?: string;

  @IsMongoId()
  @IsNotEmpty()
  idProduct?: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  unitValue?: number;

  @IsNumber()
  @IsNotEmpty()
  unitPrice?: number;

  @IsNumber()
  @IsNotEmpty()
  quantity?: number;

  @IsNumber()
  @IsNotEmpty()
  subTotal: number;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsNumber()
  @IsNotEmpty()
  discount?: number;

  @IsNumber()
  @IsNotEmpty()
  typeDiscount?: number;
}