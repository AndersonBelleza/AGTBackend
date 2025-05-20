import { IsString, IsMongoId, IsNotEmpty, IsOptional, IsNumberString, ValidateNested, IsEmail, IsObject, IsStrongPassword } from "class-validator";
import { ObjectId } from 'mongoose';

export class CreateCompanyDto {

    @IsString()
    @IsOptional()
    bool?: string;

    @IsString()
    @IsOptional()
    code?: string;

    @IsString()
    @IsOptional()
    color?: string;

    @IsMongoId()
    @IsNotEmpty()
    countryId: ObjectId;

    @IsMongoId()
    @IsNotEmpty()
    departmentId: ObjectId;

    @IsMongoId()
    @IsNotEmpty()
    provinceId: ObjectId;

    @IsMongoId()
    @IsNotEmpty()
    districtId: ObjectId;

    @IsNumberString()
    @IsOptional()
    ineiCode?: string;

    @IsMongoId()
    @IsNotEmpty()
    documentTypeId?: ObjectId;

    @IsNumberString()
    @IsNotEmpty()
    documentNumber: string;

    @IsString()
    @IsNotEmpty()
    businessName: string;

    @IsString()
    @IsNotEmpty()
    commercialName?: string;

    @IsMongoId()
    @IsNotEmpty()
    stateTypeId?: ObjectId;

    @IsString()
    @IsOptional()
    address?: string;

    @IsNumberString()
    @IsOptional()
    phone?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    // @IsOptional()
    // @IsObject()
    // @ValidateNested()
    // logo?: dataImage;

    // @IsOptional()
    // @ValidateNested({ each: true })
    // coverImage?: dataImage[];

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    electronicBilling?: Object;

    @IsOptional()
    accesses?: [];

    @IsString()
    @IsOptional()
    role?: string;

    @IsMongoId()
    @IsOptional()
    roleId?: ObjectId;
}
