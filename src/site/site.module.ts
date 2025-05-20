import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Site, SiteSchema } from './site.schema';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Site.name,
      schema: SiteSchema,
    }
  ]), 
  StatusTypeModule,
  CompanyModule
],
  controllers: [SiteController],
  providers: [SiteService],
  exports: [SiteService],
})
export class SiteModule {}