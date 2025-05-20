import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DocumentSerie, DocumentSerieSchema } from './documentSerie.schema';
import { DocumentSerieService } from './documentSerie.service';
import { DocumentSerieController } from './documentSerie.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';
import { DocumentTypeModule } from 'src/documentType/documentType.module';
import { SiteModule } from 'src/site/site.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DocumentSerie.name,
        schema: DocumentSerieSchema,
      }
    ]),
    StatusTypeModule,
    DocumentTypeModule,
    SiteModule,
  ],
  providers: [DocumentSerieService],
  controllers: [DocumentSerieController],
  exports: [DocumentSerieService],
})
export class DocumentSerieModule {}