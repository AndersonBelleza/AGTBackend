import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { StatusTypeService } from 'src/statusType/statusType.service';

@Controller('metrics')
export class MetricsController {
  constructor(
    private service: MetricsService,
    private serviceStatusType : StatusTypeService
  ){}

  @Get()
  async list(){
    try {
      return await this.service.list();
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
  
  @Post()
  async create(@Body() body: any, @Req() req: Request){
    try {
      const responseStatusType = await this.serviceStatusType.findOneWithParams( { name: 'Activo' });
      body.idStatusType = responseStatusType?._id;

      const response = await this.service.create(body);
      return response
    } catch (error) {
      throw error
    }
  }

  @Put(':id')
  async update(@Param('id')  id : string, @Body() body: any, @Req() req: Request){
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
}
