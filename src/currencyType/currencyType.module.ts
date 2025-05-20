import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CurrencyType, CurrencyTypeSchema } from './currencyType.schema';
import { CurrencyTypeService } from './currencyType.service';
import { CurrencyTypeController } from './currencyType.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CurrencyType.name,
        schema: CurrencyTypeSchema,
      }
    ]),
    StatusTypeModule,
  ],
  providers: [CurrencyTypeService],
  controllers: [CurrencyTypeController],
  exports: [CurrencyTypeService],
})
export class CurrencyTypeModule {}