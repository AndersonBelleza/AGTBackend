import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { vCacheModule } from './cache/cache.module';
import { TemplateModModule } from './templateMod/templateMod.module';
import { StatusTypeModule } from './statusType/statusType.module';
import { PersonModule } from './person/person.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { UserTypeModule } from './userType/userType.module';
import { UserModule } from './user/user.module';
import { CurrencyTypeModule} from './currencyType/currencyType.module';
import { ProductTypeModule } from './productType/productType.module';
import { ProductCategoryModule } from './productCategory/productCategory.module';
import { ProductSubCategoryModule } from './productSubCategory/productSubCategory.module';
import { ContinentModule } from './continent/continent.module';
import { CountryModule } from './country/country.module';
import { CompanyModule } from './company/company.module';
import { SiteModule } from './site/site.module';
import { PaymentMethodModule } from './paymentMethod/paymentMethod.module';
import { DeliveryMethodModule } from './deliveryMethod/deliveryMethod.module';
import { ProductModule } from './product/product.module';
import { ProductSiteModule } from './productSite/productSite.module';
import { DocumentTypeModule } from './documentType/documentType.module';
import { BrandModule } from './brand/brand.module';
import { OrderModule } from './order/order.module';
import { OperationModule } from './operation/operation.module';
import { UnitMeasureModule } from './unitMeasure/unitMeasure.module';
import { DepartamentModule } from './departament/departament.module';
import { ProvinceModule } from './province/province.module';
import { DistrictModule } from './district/district.module';
import { TypeDiscountModule } from './typeDiscount/typeDiscount.module';
import { DocumentSerieModule } from './documentSeries/documentSerie.module';
import { BannerModule } from './banner/banner.module';
import { CodePromotionalModule } from './codePromotional/codePromotional.module';
import { ProductPresentationModule } from './productPresentation/productPresentation.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://vamas:9KOYkagONl7DzOzS@equipovamas.m6ofmje.mongodb.net/agt?retryWrites=true&w=majority"), 
    vCacheModule,
    TemplateModModule,        // Plantilla de modulo para crear mas modulos
    StatusTypeModule,         // Tipo de Estado
    PersonModule,             // Persona
    AuthModule,               // Auth
    ConfigModule,             // control de modulos
    UserTypeModule,           // Tipo de Usuario
    UserModule,               // Usuario
    CurrencyTypeModule,       // Tipo de Moneda
    ProductTypeModule,        // Tipo de producto
    ProductCategoryModule,    // Categoria de producto,
    ProductSubCategoryModule, // SubCategoria de producto
    ContinentModule,          // Continente
    CountryModule,            // País
    CompanyModule,            // Empresa,
    SiteModule,               // Sede
    PaymentMethodModule,      // Métodos de pago   
    DeliveryMethodModule,     // Métodos de delivery/envio,
    ProductModule,            // Producto
    ProductSiteModule,        // Producto Sede
    ProductPresentationModule,// Producto Presentación
    DocumentTypeModule,       // Tipo Documento 
    BrandModule,              // Marca
    OrderModule,              // Orden - Pedido
    OperationModule,          // Se pueden usar EndPoint variados que no necesiten ser registrados
    UnitMeasureModule,        // Unidad de Medida
    DepartamentModule,        // Departamento
    ProvinceModule,           // Provincia
    DistrictModule,           // Distrito
    TypeDiscountModule,       // Tipo de Descuento
    DocumentSerieModule,      // Documento Serie (punto tipo comprobante)
    BannerModule,             // Banner
    CodePromotionalModule,    // Codigo de Promoción
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}