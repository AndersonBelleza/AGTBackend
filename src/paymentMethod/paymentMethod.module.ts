import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PaymentMethod, PaymentMethodSchema } from './paymentMethod.schema';
import { PaymentMethodService } from './paymentMethod.service';
import { PaymentMethodController } from './paymentMethod.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PaymentMethod.name,
        schema: PaymentMethodSchema,
      }
    ]),
    StatusTypeModule,
  ],
  providers: [PaymentMethodService],
  controllers: [PaymentMethodController],
  exports: [PaymentMethodService],
})
export class PaymentMethodModule {}