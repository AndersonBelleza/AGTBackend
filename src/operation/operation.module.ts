import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OperationController } from './operation.controller';
import { HttpModule } from '@nestjs/axios';
import { CompanyModule } from 'src/company/company.module';
import { DocumentTypeModule } from 'src/documentType/documentType.module';

@Module({
  imports: [
    MongooseModule.forFeature(),
    HttpModule,
    CompanyModule,
    DocumentTypeModule,
  ],
  controllers: [OperationController],
})
export class OperationModule {}