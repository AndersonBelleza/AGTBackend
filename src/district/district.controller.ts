import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put } from '@nestjs/common';
import { DistrictService } from './district.service';
import { StatusTypeService } from 'src/statusType/statusType.service';
import mongoose from 'mongoose';
import { UpdateDistrictDto } from './dto/updateDistrict.dto';
import { CreateDistrictDto } from './dto/createDistrict.dto';
import axios from 'axios';

@Controller('District')
export class DistrictController {
  constructor(
    private service: DistrictService,
    private statusTypeService: StatusTypeService,
  ){}

  @Get()
  async list(){
    try {
      return await this.service.list();
    } catch (error) {
      throw error;
    }
  }

  @Get('migrarData/a')
  async migrarData(){


      const options = {
        method: 'GET',
        url: 'https://api-cpe.sunat.gob.pe/v1/contribuyente/gre/comprobantes/ubigeo',
        headers: {
          Authorization: 'Bearer eyJraWQiOiJhcGkuc3VuYXQuZ29iLnBlLmtpZDAwMSIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyMDYwOTg3ODMxMyIsImF1ZCI6Ilt7XCJhcGlcIjpcImh0dHBzOlwvXC9hcGktY3BlLnN1bmF0LmdvYi5wZVwiLFwicmVjdXJzb1wiOlt7XCJpZFwiOlwiXC92MVwvY29udHJpYnV5ZW50ZVwvZ3JlXCIsXCJpbmRpY2Fkb3JcIjpcIjFcIixcImd0XCI6XCIxMDAxMDBcIn0se1wiaWRcIjpcIlwvdjFcL2NvbnRyaWJ1eWVudGVcL3BhcmFtZXRyb3NcIixcImluZGljYWRvclwiOlwiMVwiLFwiZ3RcIjpcIjEwMDEwMFwifSx7XCJpZFwiOlwiXC92MVwvY29udHJpYnV5ZW50ZVwvY29udHJpYnV5ZW50ZXNcIixcImluZGljYWRvclwiOlwiMVwiLFwiZ3RcIjpcIjEwMDEwMFwifV19LHtcImFwaVwiOlwiaHR0cHM6XC9cL2FwaS5zdW5hdC5nb2IucGVcIixcInJlY3Vyc29cIjpbe1wiaWRcIjpcIlwvdjFcL2NvbnRyaWJ1eWVudGVcL2NvbnRyaWJ1eWVudGVzXCIsXCJpbmRpY2Fkb3JcIjpcIjFcIixcImd0XCI6XCIxMDAxMDBcIn1dfV0iLCJ1c2VyZGF0YSI6eyJudW1SVUMiOiIyMDYwOTg3ODMxMyIsInRpY2tldCI6IjE2MTIxNzA4ODk2IiwibnJvUmVnaXN0cm8iOiIiLCJhcGVNYXRlcm5vIjoiIiwibG9naW4iOiIyMDYwOTg3ODMxM1NFRVBFRElDIiwibm9tYnJlQ29tcGxldG8iOiJWQU1BUyBTLkEuQy4iLCJub21icmVzIjoiVkFNQVMgUy5BLkMuIiwiY29kRGVwZW5kIjoiMDEwMyIsImNvZFRPcGVDb21lciI6IiIsImNvZENhdGUiOiIiLCJuaXZlbFVPIjowLCJjb2RVTyI6IiIsImNvcnJlbyI6IiIsInVzdWFyaW9TT0wiOiJTRUVQRURJQyIsImlkIjoiIiwiZGVzVU8iOiIiLCJkZXNDYXRlIjoiIiwiYXBlUGF0ZXJubyI6IiIsImlkQ2VsdWxhciI6bnVsbCwibWFwIjp7ImlzQ2xvbiI6ZmFsc2UsImRkcERhdGEiOnsiZGRwX251bXJ1YyI6IjIwNjA5ODc4MzEzIiwiZGRwX251bXJlZyI6IjAxMDMiLCJkZHBfZXN0YWRvIjoiMDAiLCJkZHBfZmxhZzIyIjoiMDAiLCJkZHBfdWJpZ2VvIjoiMTEwMjA3IiwiZGRwX3RhbWFubyI6IjAzIiwiZGRwX3Rwb2VtcCI6IjM5IiwiZGRwX2NpaXUiOiI1MjM5MSJ9LCJpZE1lbnUiOiIxNjEyMTcwODg5NiIsImpuZGlQb29sIjoicDAxMDMiLCJ0aXBVc3VhcmlvIjoiMCIsInRpcE9yaWdlbiI6IklUIiwicHJpbWVyQWNjZXNvIjp0cnVlfX0sIm5iZiI6MTczNjE4MzgzNSwiY2xpZW50SWQiOiJmMTIzMDE0MC1hNjVkLTRiMjctOGQ3OC1iZDNhMTE5NGU5ZTMiLCJpc3MiOiJodHRwczpcL1wvYXBpLXNlZ3VyaWRhZC5zdW5hdC5nb2IucGVcL3YxXC9jbGllbnRlc3NvbFwvZjEyMzAxNDAtYTY1ZC00YjI3LThkNzgtYmQzYTExOTRlOWUzXC9vYXV0aDJcL3Rva2VuXC8iLCJleHAiOjE3MzYxODc0MzUsImdyYW50VHlwZSI6ImF1dGhvcml6YXRpb25fdG9rZW4iLCJpYXQiOjE3MzYxODM4MzV9.DcP8OmkU99meE5PsqJCQ-dBkJwVVbBjpqPZXs5xyIpIUeZNG9jG4DE5jgFY7lsqj0qANSBIjpv-8bAQwQUArHHZbQeOjbhv9dv-2TQUm-fEQK4ouehq_nOxqnIqIqrZP7QxpS_cT_zAgDvmvT-DWGpEDRmJMOpT5th-CCKYxiimVGblHtJQpb_gKq3cWGIAFAMS3NgBYuNlZU2bsHmmyd_ABP4WNAbIIyCY0A13LLgNOyA1S5Yk-xNPg4V46uJboCUEHMmpPic82nuiJz-TAMajfMFRo_E1IUtMzKGwBVK7HQAEpiL9o2ivnwwFA7ZQqWN--5lkyelkR_znDX9h7YA',
          'Content-Type': 'application/json'
        }
      };

      var datMigracion = await axios(options)
      .then(async responseQ => {
        // console.log('Respuesta1:', responseQ);
        if(responseQ.data[0]?.desParam){
          responseQ.data[0].listaParametro.forEach((element:any) => {
            
          });
        }
        console.log('RES:', responseQ.data[0]?.desParam);
        return responseQ.data[0];
        
      })
      .catch(error => {
        console.error('Error1:', error);
        console.error('Error2:', error.response?.data);
        return error;
      });
      console.log("datMigracion ",datMigracion);
    
    return "hola"
  }

  @Get('byProvince/:idProvince')
  async listByDepartament(@Param('idProvince') idProvince : any){
    try {
      let body:any  = {};

      if(idProvince){
        body.idProvince = new mongoose.Types.ObjectId(idProvince);
      }

      return await this.service.listWithParams(body);
    } catch (error) {
      throw error;
    }
  }

  @Post('listWithParams')
  async listWithParams(@Body() body: any){
    try {
      
      if(body.name){
        body.name = {$regex: new RegExp(body.name, 'i')};
      }
      
      return await this.service.listWithParams(body);
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
  async create(@Body() body: CreateDistrictDto, @Req() req: Request){
    try {
      if(!body.idStatusType){
        // Cambiar proccess si es necesario, por ahora lo dejo con Default
        const statusType = await this.statusTypeService.findOneWithParams({name:"Activo", proccess: "Default"});
        if(!statusType) throw 'Tipo de Estado Activo no encontrado..!';
        body.idStatusType = statusType?._id;
      }else{
        body.idStatusType = new mongoose.Types.ObjectId(body?.idStatusType);
      }

      if(body.idProvince){
        body.idProvince = new mongoose.Types.ObjectId(body?.idProvince);

      }
      
      const response = await this.service.create(body);
      return response
    } catch (error) {
      throw error
    }
  }

  @Put(':id')
  async update(@Param('id')  id : string, @Body() body: UpdateDistrictDto, @Req() req: Request){
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
