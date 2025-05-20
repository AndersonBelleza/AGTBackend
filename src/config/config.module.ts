import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';

@Module({
  imports: [MongooseModule.forFeature([

  ])],
  controllers: [ConfigController],
  providers: [ConfigService],
})
export class ConfigModule {}