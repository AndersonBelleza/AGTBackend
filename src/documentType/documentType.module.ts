import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DocumentType, DocumentTypeSchema } from './documentType.schema';
import { DocumentTypeService } from './documentType.service';
import { DocumentTypeController } from './documentType.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DocumentType.name,
        schema: DocumentTypeSchema,
      }
    ]),
    StatusTypeModule,
  ],
  providers: [DocumentTypeService],
  controllers: [DocumentTypeController],
  exports: [DocumentTypeService],
})
export class DocumentTypeModule {}