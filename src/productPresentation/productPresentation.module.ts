import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductPresentation, ProductPresentationSchema } from './productPresentation.schema';
import { ProductPresentationService } from './productPresentation.service';
import { ProductPresentationController } from './productPresentation.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';
import { CurrencyTypeModule } from 'src/currencyType/currencyType.module';
import { ProductTypeModule } from 'src/productType/productType.module';
import { ProductCategoryModule } from 'src/productCategory/productCategory.module';
import { ProductSubCategoryModule } from 'src/productSubCategory/productSubCategory.module';
import { BrandModule } from 'src/brand/brand.module';
import { CompanyModule } from 'src/company/company.module';
import { SiteModule } from 'src/site/site.module';
import { ProductSiteModule } from 'src/productSite/productSite.module';
import { ProductModule } from 'src/product/product.module';
import { DocumentSerieModule } from 'src/documentSeries/documentSerie.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductPresentation.name,
        schema: ProductPresentationSchema,
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
    ProductModule,
    DocumentSerieModule
  ],
  providers: [ProductPresentationService],
  controllers: [ProductPresentationController],
  exports: [ProductPresentationService],
})
export class ProductPresentationModule {}