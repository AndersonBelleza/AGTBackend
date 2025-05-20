import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StatusTypeService } from 'src/statusType/statusType.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs'
import { MetricsService } from 'src/metrics/metrics.service';

@Injectable()
export class AuthService {
  constructor(
    private userService : UserService,
    private jwtService : JwtService,
    private serviceStatusType : StatusTypeService,
    private serviceMetrics: MetricsService,
  ) {}

  async singIn(username:string,password:string){
    try{
    
      const userSelected : any = await this.userService.findOneWithParams({username : username});

      if(!userSelected || !userSelected._id){
        throw ({message: 'Usuario no encontrado'});
      }
      const validation = await bcrypt.compare(password,userSelected.password);
      if(!validation){
        throw new UnauthorizedException('Clave incorrecta');
      }

      const responseStatusType = await this.serviceStatusType.findOneWithParams( { name: 'Activo' });
      const token = await this.jwtService.signAsync({id: userSelected._id, username: userSelected.username });

      if(token) {
        const dataMetrics : any = {
          name: 'User',
          description: 'Inició sesión',
          type: 'Login',
          idUser: userSelected._id,
          idStatusType: responseStatusType?._id
        }
        
        await this.serviceMetrics.create(dataMetrics)
        
        return {
          access_token: token,
          id: userSelected._id,
          user: userSelected.username,
          role: userSelected?.role,
          name: userSelected?.name,
          phone: userSelected?.phone,
          email: userSelected?.email,
          quizz: userSelected?.quizz,
          userSite: userSelected?.userSite
        }
      }


    }catch(error){
      return error;
    }
  }

}