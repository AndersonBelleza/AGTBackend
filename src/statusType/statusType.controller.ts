import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { StatusTypeService } from './statusType.service';
import { CreateStatusTypeDto } from './dto/createStatusType.dto';
import { UpdateStatusTypeDto } from './dto/updateStatusType.dto';

@Controller('statusType')
export class StatusTypeController {
  constructor(
    private service: StatusTypeService,
  ){}

  @Get()
  async list(){
    try {
      return await this.service.list();
    } catch (error) {
      throw error;
    }
  }

  @Get('filter/:proccess')
  async listFilter(@Param('proccess') process : any){
    try {
      let json:any = {};
      if(process){
        json.proccess = process
      }
      return await this.service.listWithParams(json);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findId(@Param('id') id:string){
    try {
      const response =  await this.service.findId(id);
      if(!response) throw new NotFoundException('Elemento no encontrado..!');
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  @Post('statusTypeNameSearch/')
  async statusTypeNameSearch(@Body() body: any, @Req() req: Request){
    try {
      var response = await this.service.findOneWithParams({nombre : body.nombre});
      if(!response) throw new NotFoundException('Elemento no encontrado..!');
      return response;
    } catch (error) {
      throw error; 
    }
  }

  @Post('statusTypeSearchProccess/')
  async statusTypeSearch(@Body() body: any, @Req() req: Request){
    try {
      var response = await this.service.listWithParams(body);
      if(!response) throw new NotFoundException('Elemento no encontrado..!');
      return response;
    } catch (error) {
      throw error; 
    }
  }

  @Post()
  async create(@Body() body: CreateStatusTypeDto, @Req() req: Request){
    try {
      const response = await this.service.create(body);
      return response
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  @Put(':id')
  async update(@Param('id')  id : string, @Body() body: UpdateStatusTypeDto, @Req() req: Request){
    try {
      const response = await this.service.update(id, body);
      if(!response) throw new NotFoundException('Elemento no encontrado...!');
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id:string, @Req() req: Request){
    try {
      const response = await this.service.delete(id);
      if(!response) throw new NotFoundException('Elemento no eliminado...!');
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Get('getStatusOrders/proccess')
  async getStatusOrders(@Body() body : any, @Req() req: Request){
    try{
      const { proccess } = body;


      const response = await this.service.listWithParams({proccess : "Order"});
      if(!response) throw ('Elemento no encontrado..!');
      return response;

    }catch(err){
      console.log("errorListAsyncStatusType",err);
      return err
    }
  }
  @Post('listWithParamsAsyncPopulate')
  async listWithParamsAsyncPopulate(@Body() body : any, @Req() req: Request){
    try{
      const { page = 0, limit = null } = body;
      let skip = 0;
      console.log("body",body);
      if (page && limit) {
        skip = page * limit;
      }
      if(body.limit){
        delete body.limit;
        delete body.page;
      }

      const response = await this.service.listWithParamsAsyncPopulate(skip, limit, body);
      if(!response) throw ('Elemento no encontrado..!');
      return response;

    }catch(err){
      console.log("errorListAsyncStatusType",err);
      return err
    }
  }
}
