import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Route, RouteSchema } from './route.schema';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Route.name,
        schema: RouteSchema,
      }
    ]),
    StatusTypeModule,
  ],
  providers: [RouteService],
  controllers: [RouteController],
  exports: [RouteService],
})
export class RouteModule {}