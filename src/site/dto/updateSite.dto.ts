import { IsArray, IsMongoId, IsOptional, IsString } from "class-validator";
import { ObjectId, Types } from 'mongoose';

export class UpdateSiteDto {
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

    @IsString()
    @IsOptional()
    address?: String;

    @IsMongoId()
    @IsOptional()
    idStatusType?: Types.ObjectId;

    @IsMongoId()
    @IsOptional()
    idCompany?: Types.ObjectId;

    @IsArray()
    @IsOptional()
    faq?: [];
}
