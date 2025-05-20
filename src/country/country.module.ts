import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Country, CountrySchema } from './country.schema';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Country.name,
        schema: CountrySchema,
      }
    ]),
    StatusTypeModule,
  ],
  providers: [ CountryService ],
  controllers: [CountryController],
  exports: [ CountryService ],
})
export class CountryModule {}