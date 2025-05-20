import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Product, ProductSchema } from './product.schema';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';
import { CurrencyTypeModule } from 'src/currencyType/currencyType.module';
import { ProductTypeModule } from 'src/productType/productType.module';
import { ProductCategoryModule } from 'src/productCategory/productCategory.module';
import { ProductSubCategoryModule } from 'src/productSubCategory/productSubCategory.module';
import { BrandModule } from 'src/brand/brand.module';
import { CompanyModule } from 'src/company/company.module';
import { SiteModule } from 'src/site/site.module';
import { ProductSiteModule } from 'src/productSite/productSite.module';
import { DocumentSerieModule } from 'src/documentSeries/documentSerie.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      }
    ]),
    StatusTypeModule,
    CurrencyTypeModule,
    ProductTypeModule,
    ProductCategoryModule,
    ProductSubCategoryModule,
    BrandModule,
    CompanyModule,
    SiteModule,
    ProductSiteModule,
    DocumentSerieModule
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}