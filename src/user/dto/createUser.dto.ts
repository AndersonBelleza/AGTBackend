import { IsArray, IsDate, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { ObjectId, Types } from 'mongoose';

export class CreateUserDto {
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
    @IsOptional()
    value?: String;

    @IsMongoId()
    @IsOptional()
    idStatusType?: Types.ObjectId;

    @IsMongoId()
    @IsNotEmpty()
    idPerson: Types.ObjectId;

    @IsMongoId()
    @IsOptional()
    idCompany?: Types.ObjectId;

    @IsMongoId()
    @IsOptional()
    idSite?: Types.ObjectId;

    @IsMongoId()
    @IsOptional()
    idUserType?: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    username: String;

    @IsString()
    @IsNotEmpty()
    password: String;

    @IsArray()
    @IsOptional()
    images?: [{}];

    @IsObject()
    @IsOptional()
    specs?: {};

    @IsArray()
    @IsOptional()
    favorites?: [{}];

    @IsString()
    @IsOptional()
    telephone?: String;

    @IsString()
    @IsOptional()
    email?: String;

    @IsArray()
    @IsOptional()
    userSite?: [{
        webAccess:String, 
        idCompany:Types.ObjectId,
        idSite:Types.ObjectId,
    }];

    @IsArray()
    @IsOptional()
    addresses?: [{
        address?:String,
        idDepartament:Types.ObjectId,
        idProvince:Types.ObjectId,
        idDistrict:Types.ObjectId,
        orden:number,
        selected:boolean,
    }];

}
