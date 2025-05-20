import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TOKEN_SECRET } from 'src/config';
import { StatusTypeModule } from 'src/statusType/statusType.module';
import { MetricsModule } from 'src/metrics/metrics.module';

@Module({
  imports: [
    MongooseModule.forFeature([

    ]),
    UserModule,
    MetricsModule,
    StatusTypeModule,
    JwtModule.register({
      global : true,
      secret : TOKEN_SECRET,
      signOptions: { expiresIn: "1D"},
    })
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}