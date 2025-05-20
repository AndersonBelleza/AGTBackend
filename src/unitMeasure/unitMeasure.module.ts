import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UnitMeasure, UnitMeasureSchema } from './unitMeasure.schema';
import { UnitMeasureService } from './unitMeasure.service';
import { UnitMeasureController } from './unitMeasure.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UnitMeasure.name,
        schema: UnitMeasureSchema,
      }
    ]),
    StatusTypeModule,
  ],
  providers: [UnitMeasureService],
  controllers: [UnitMeasureController],
  exports: [UnitMeasureService],
})
export class UnitMeasureModule {}