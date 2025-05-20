import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductCategory, ProductCategorySchema } from './productCategory.schema';
import { ProductCategoryService } from './productCategory.service';
import { ProductCategoryController } from './productCategory.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';
import { ProductSite, ProductSiteSchema } from 'src/productSite/productSite.schema';
import { ProductSiteService } from 'src/productSite/productSite.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductCategory.name,
        schema: ProductCategorySchema,
      },
      {
        name: ProductSite.name,
        schema: ProductSiteSchema,
      }
    ]),
    StatusTypeModule,
  ],
  providers: [ProductCategoryService,ProductSiteService],
  controllers: [ProductCategoryController],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}