import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException, HttpStatus, UseGuards, Request, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs'

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService : JwtService,
    private service: AuthService,
    private userService : UserService
  ){}

  @HttpCode(HttpStatus.OK)
  @Post('loginWeb')
  async signInWeb(@Body() signInDto: {username : string, password:string, webAccess:string}) {
    try{
      // console.log("signInDto ",signInDto);
      
      const userSelected:any = await this.userService.findOneWithParamsLogin({ "username": signInDto?.username });
      console.log("userSelected",userSelected); 
      if(!userSelected || !userSelected._id){
        throw ('Usuario no encontrado');
      }
      const user = userSelected.userSite.find((obj)=>obj.webAccess == signInDto?.webAccess);
      if(!user){
        throw ('El usuario no se encuentra disponible en esta Web');
      }
      
      const validation = await bcrypt.compare(signInDto?.password, userSelected.password);
      if(!validation){
        throw ('Clave incorrecta');
      }
      if(userSelected?.idUserType?.name == "Admin"){
        const token = await this.jwtService.signAsync({id: userSelected._id, username: userSelected.username });
        return {
          access_token: token,
          id: userSelected._id,
          user: userSelected.username,
          idSite: user.idSite,
          idCompany	: user.idCompany,
        }
      }else{
        return {
          id: userSelected._id,
          user: userSelected.username,
          idSite: user.idSite,
          idCompany	: user.idCompany,
        }
      }

      
    } catch (error) {
      console.log("error", error);
      throw new InternalServerErrorException(error);
    }
  }
    
  
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: {username : string, password:string}) {
    try{
      return this.service.singIn(signInDto.username, signInDto.password);
    }catch(error){
      return error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Body() req) {
    let userSelected = await this.userService.findOneWithParams({username : req.username});
    if(userSelected && userSelected._id){
    console.log("sientro");

      return userSelected;
    }
    console.log("req",req);
    return req;
  }
}
