import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DeliveryMethod, DeliveryMethodSchema } from './deliveryMethod.schema';
import { DeliveryMethodService } from './deliveryMethod.service';
import { DeliveryMethodController } from './deliveryMethod.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DeliveryMethod.name,
        schema: DeliveryMethodSchema,
      }
    ]),
    StatusTypeModule,
  ],
  providers: [DeliveryMethodService],
  controllers: [DeliveryMethodController],
  exports: [DeliveryMethodService],
})
export class DeliveryMethodModule {}