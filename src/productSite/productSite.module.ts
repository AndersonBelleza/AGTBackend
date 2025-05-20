import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductSite, ProductSiteSchema } from './productSite.schema';
import { ProductSiteService } from './productSite.service';
import { ProductoSiteController } from './productSite.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';
import { ProductCategoryModule } from 'src/productCategory/productCategory.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductSite.name,
        schema: ProductSiteSchema,
      }
    ]),
    StatusTypeModule,
    ProductCategoryModule,
  ],
  providers: [ProductSiteService],
  controllers: [ProductoSiteController],
  exports: [ProductSiteService],
})
export class ProductSiteModule {}