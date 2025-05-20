import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Person, PersonSchema } from './person.schema';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { StatusTypeModule } from 'src/statusType/statusType.module';
import { DocumentTypeModule } from 'src/documentType/documentType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Person.name,
        schema: PersonSchema,
      }
    ]),
    StatusTypeModule,
    DocumentTypeModule
  ],
  providers: [PersonService],
  controllers: [PersonController],
  exports: [PersonService],
})
export class PersonModule {}