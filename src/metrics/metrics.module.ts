import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Metrics, MetricsSchema } from './metrics.schema';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { StatusType, StatusTypeSchema } from 'src/statusType/statusType.schema';
import { StatusTypeModule } from 'src/statusType/statusType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Metrics.name,
        schema: MetricsSchema,
      },
    ]),
    StatusTypeModule
  ],
  controllers: [MetricsController],
  providers: [MetricsService],
  exports: [MetricsService],
})

export class MetricsModule {}