import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Company, CompanySchema } from './company.schema';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';
import { CountryModule } from 'src/country/country.module';
import { DocumentTypeModule } from 'src/documentType/documentType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Company.name,
        schema: CompanySchema,
      }
    ]),
    StatusTypeModule,
    CountryModule,
    DocumentTypeModule
  ],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule {}