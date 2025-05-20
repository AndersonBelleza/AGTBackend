import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Departament, DepartamentSchema } from './departament.schema';
import { DepartamentService } from './departament.service';
import { DepartamentController } from './departament.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Departament.name,
        schema: DepartamentSchema,
      }
    ]),
    StatusTypeModule,
  ],
  providers: [DepartamentService],
  controllers: [DepartamentController],
  exports: [DepartamentService],
})
export class DepartamentModule {}