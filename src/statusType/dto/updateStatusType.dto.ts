import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ObjectId, Types } from 'mongoose';

export class UpdateStatusTypeDto {
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
    proccess?: String;
}
