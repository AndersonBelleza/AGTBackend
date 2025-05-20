import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { District, DistrictSchema } from './district.schema';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: District.name,
        schema: DistrictSchema,
      }
    ]),
    StatusTypeModule,
  ],
  providers: [DistrictService],
  controllers: [DistrictController],
  exports: [DistrictService],
})
export class DistrictModule {}