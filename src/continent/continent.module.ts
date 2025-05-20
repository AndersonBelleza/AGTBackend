import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Continent, ContinentSchema } from './continent.schema';
import { ContinentService } from './continent.service';
import { ContinentController } from './continent.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Continent.name,
        schema: ContinentSchema,
      }
    ]),
    StatusTypeModule,
  ],
  providers: [ContinentService],
  controllers: [ContinentController],
  exports: [ContinentService],
})
export class ContinentModule {}