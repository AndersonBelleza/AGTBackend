import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TemplateMod, TemplateModSchema } from './templateMod.schema';
import { TemplateModService } from './templateMod.service';
import { TemplateModController } from './templateMod.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TemplateMod.name,
        schema: TemplateModSchema,
      }
    ]),
    StatusTypeModule,
  ],
  providers: [TemplateModService],
  controllers: [TemplateModController],
  exports: [TemplateModService],
})
export class TemplateModModule {}