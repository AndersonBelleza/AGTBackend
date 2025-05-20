import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserType, UserTypeSchema } from './userType.schema';
import { UserTypeService } from './userType.service';
import { UserTypeController } from './userType.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserType.name,
        schema: UserTypeSchema,
      }
    ]),
    StatusTypeModule,
  ],
  providers: [UserTypeService],
  controllers: [UserTypeController],
  exports: [UserTypeService],
})
export class UserTypeModule {}