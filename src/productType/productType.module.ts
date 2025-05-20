import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductType, ProductTypeSchema } from './productType.schema';
import { ProductTypeService } from './productType.service';
import { ProductTypeController } from './productType.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductType.name,
        schema: ProductTypeSchema,
      }
    ]),
    StatusTypeModule,
  ],
  providers: [ProductTypeService],
  controllers: [ProductTypeController],
  exports: [ProductTypeService],
})
export class ProductTypeModule {}