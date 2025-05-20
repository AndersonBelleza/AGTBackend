import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Brand, BrandSchema } from './brand.schema';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Brand.name,
        schema: BrandSchema,
      }
    ]),
    StatusTypeModule,
  ],
  providers: [BrandService],
  controllers: [BrandController],
  exports: [BrandService],
})
export class BrandModule {}