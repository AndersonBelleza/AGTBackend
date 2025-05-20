import { IsString, IsMongoId, IsOptional, IsNumberString, IsEmail, ValidateNested, IsObject } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateCompanyDto {
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
  @IsOptional()
  countryId?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  departmentId?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  provinceId?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  districtId?: Types.ObjectId;

  @IsNumberString()
  @IsOptional()
  ineiCode?: string;

  @IsMongoId()
  @IsOptional()
  documentTypeId?: Types.ObjectId;

  @IsNumberString()
  @IsOptional()
  documentNumber?: string;

  @IsString()
  @IsOptional()
  businessName?: string;

  @IsString()
  @IsOptional()
  commercialName?: string;

  @IsMongoId()
  @IsOptional()
  statusTypeId?: Types.ObjectId;

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
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  electronicBilling?: Object;

  @IsOptional()
  accesses?: string[];

  @IsString()
  @IsOptional()
  role?: string;

  @IsMongoId()
  @IsOptional()
  roleId?: Types.ObjectId;
}
