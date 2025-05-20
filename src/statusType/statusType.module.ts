import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StatusTypeService } from './statusType.service';
import { StatusTypeController } from './statusType.controller';
import { StatusType, StatusTypeSchema } from './statusType.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: StatusType.name,
        schema: StatusTypeSchema,
      }
    ]),
  ],
  providers: [StatusTypeService],
  controllers: [StatusTypeController],
  exports: [StatusTypeService],
})
export class StatusTypeModule {}