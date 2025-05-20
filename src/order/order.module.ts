import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Order, OrderSchema } from './order.schema';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';
import { PaymentMethodModule } from 'src/paymentMethod/paymentMethod.module';
import { DeliveryMethodModule } from 'src/deliveryMethod/deliveryMethod.module';
import { DocumentSerieModule } from 'src/documentSeries/documentSerie.module';
import { ProductModule } from 'src/product/product.module';
import { CurrencyTypeModule } from 'src/currencyType/currencyType.module';
import { ProductSiteModule } from 'src/productSite/productSite.module';
import { ProductPresentationModule } from 'src/productPresentation/productPresentation.module';
import { UserModule } from 'src/user/user.module';
import { PersonModule } from 'src/person/person.module';
import { CompanyModule } from 'src/company/company.module';
import { SiteModule } from 'src/site/site.module';
import { DocumentTypeModule } from 'src/documentType/documentType.module';
import { HttpModule } from '@nestjs/axios';
import { DepartamentModule } from 'src/departament/departament.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      }
    ]),
    StatusTypeModule,
    PaymentMethodModule,
    DeliveryMethodModule,
    DocumentTypeModule,
    DocumentSerieModule,
    ProductModule,
    CurrencyTypeModule,
    ProductSiteModule,
    ProductPresentationModule,
    PersonModule,
    UserModule,
    CompanyModule,
    SiteModule,
    HttpModule,
    DepartamentModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}