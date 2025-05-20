import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductSubCategory, ProductSubCategorySchema } from './productSubCategory.schema';
import { ProductSubCategoryService } from './productSubCategory.service';
import { ProductSubCategoryController } from './productSubCategory.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';
import { ProductCategoryModule } from 'src/productCategory/productCategory.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductSubCategory.name,
        schema: ProductSubCategorySchema,
      }
    ]),
    StatusTypeModule,
    ProductCategoryModule,
  ],
  providers: [ProductSubCategoryService],
  controllers: [ProductSubCategoryController],
  exports: [ProductSubCategoryService],
})
export class ProductSubCategoryModule {}