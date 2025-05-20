import { IsArray, IsMongoId, isNotEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ObjectId, Types } from 'mongoose';

export class CreateSiteDto {
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

    @IsString()
    @IsNotEmpty()
    address: String;

    @IsMongoId()
    @IsNotEmpty()
    idStatusType: Types.ObjectId;

    @IsMongoId()
    @IsNotEmpty()
    idCompany: Types.ObjectId;

    @IsArray()
    @IsOptional()
    faq?: [];

    @IsArray()
    @IsOptional()
    contacts?: [];

}
