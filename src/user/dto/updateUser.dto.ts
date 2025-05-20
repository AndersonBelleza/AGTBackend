import { IsArray, IsDate, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { ObjectId, Types } from 'mongoose';

export class UpdateUserDto {
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
    value?: String;

    @IsMongoId()
    @IsOptional()
    idStatusType?: Types.ObjectId;

    @IsMongoId()
    @IsOptional()
    idPerson?: Types.ObjectId;

    @IsString()
    @IsOptional()
    username?: String;

    @IsString()
    @IsOptional()
    password?: String;

    @IsArray()
    @IsOptional()
    images?: [{}];

    @IsObject()
    @IsOptional()
    specs?: {};

    @IsArray()
    @IsOptional()
    favorites?: [{}];

    @IsArray()
    @IsOptional()
    addresses?: [{}];

    @IsString()
    @IsOptional()
    telephone?: String;

    @IsString()
    @IsOptional()
    email?: String;

    @IsMongoId()
    @IsOptional()
    idCompany?: Types.ObjectId;

    @IsMongoId()
    @IsOptional()
    idSite?: Types.ObjectId;

    @IsMongoId()
    @IsOptional()
    idUserType?: Types.ObjectId;

    // @IsString()
    // @IsOptional()
    // document?: String;
    
    // @IsString()
    // @IsOptional()
    // typeDocument?: String;

}