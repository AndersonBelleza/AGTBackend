import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ObjectId, Types } from 'mongoose';

export class CreateStatusTypeDto {
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
    proccess?: String;
}
