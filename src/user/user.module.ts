import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema, User } from './user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StatusTypeModule } from 'src/statusType/statusType.module';
import { PersonModule } from 'src/person/person.module';
import { DocumentTypeModule } from 'src/documentType/documentType.module';
import { UserTypeModule } from 'src/userType/userType.module';
import { MetricsModule } from 'src/metrics/metrics.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      }
    ]),
    StatusTypeModule,
    PersonModule,
    DocumentTypeModule,
    UserTypeModule,
    MetricsModule
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}