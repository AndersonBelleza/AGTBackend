import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Province, ProvinceSchema } from './province.schema';
import { ProvinceService } from './province.service';
import { ProvinceController } from './province.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Province.name,
        schema: ProvinceSchema,
      }
    ]),
    StatusTypeModule,
  ],
  providers: [ProvinceService],
  controllers: [ProvinceController],
  exports: [ProvinceService],
})
export class ProvinceModule {}