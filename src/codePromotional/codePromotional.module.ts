import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CodePromotional, CodePromotionalSchema } from './codePromotional.schema';
import { CodePromotionalService } from './codePromotional.service';
import { CodePromotionalController } from './codePromotional.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CodePromotional.name,
        schema: CodePromotionalSchema,
      }
    ]),
    StatusTypeModule,
  ],
  providers: [CodePromotionalService],
  controllers: [CodePromotionalController],
  exports: [CodePromotionalService],
})
export class CodePromotionalModule {}