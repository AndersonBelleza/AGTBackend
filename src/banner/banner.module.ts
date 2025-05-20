import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Banner, BannerSchema } from './banner.schema';
import { BannerController } from './banner.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';
import { BannerService } from './banner.service';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Banner.name,
        schema: BannerSchema,
      }
    ]),
    StatusTypeModule,
    CompanyModule,
  ],
  providers: [BannerService],
  controllers: [BannerController],
  exports: [BannerService],
})
export class BannerModule {}