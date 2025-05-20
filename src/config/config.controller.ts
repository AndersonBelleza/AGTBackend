import {  Controller, Get, Param, Req, UseGuards} from "@nestjs/common";
import { ConfigService } from "./config.service";
import { AuthGuard } from "src/auth/auth.guard";

@Controller('config')
export class ConfigController{
  constructor( private configService: ConfigService){}

  @Get('all')
  allListener(@Req() req: Request){
    return this.configService.TemporalData();
  }

  // @UseGuards(AuthGuard)
  @Get('removeOne/:configName')
  removeOneList(@Param('configName') collectionName: string, @Req() req: Request){
    return this.configService.resetOne(collectionName);
  }
  // @UseGuards(AuthGuard)
  @Get('removeOne2/:configName')
  deleteOneList(@Param('configName') collectionName: string, @Req() req: Request){
    return this.configService.deleteOne(collectionName);
  }
}