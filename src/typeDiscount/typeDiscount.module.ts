import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TypeDiscountService } from './typeDiscount.service';
import { TypeDiscountController } from './typeDiscount.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';
import { TypeDiscount, TypeDiscountSchema } from './typeDiscount.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TypeDiscount.name,
        schema: TypeDiscountSchema,
      }
    ]),
    StatusTypeModule,
  ],
  providers: [TypeDiscountService],
  controllers: [TypeDiscountController],
  exports: [TypeDiscountService],
})
export class TypeDiscountModule {}