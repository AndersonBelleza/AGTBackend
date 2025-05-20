import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ 
    allowedHeaders: ["*"], 
    origin: [/^http?:\/\/localhost$/],     // esto se utiliza cuando el front no es una instancia, ejemplo: html con js vanilla
    // origin: [/^http?:\/\/localhost:\d+$/], // (:\d+) Se utiliza cuando el front está instanciado en un puerto..
    // origin: ["https://baobao.pe", /^http?:\/\/localhost:\d+$/, "https://www.baobao.pe"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  });

  app.useGlobalPipes(new ValidationPipe({transform: true}));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  await app.listen(6060);

}
bootstrap();