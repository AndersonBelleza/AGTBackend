import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, NotFoundException, Req, Put, ConflictException, UseInterceptors, UploadedFiles, InternalServerErrorException } from '@nestjs/common';
import { UserService } from './user.service';
import { StatusTypeService } from 'src/statusType/statusType.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs'
import { PersonService } from 'src/person/person.service';
import { DocumentTypeService } from 'src/documentType/documentType.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { createFolder, uploadFileS3Many, verifyFolder } from 'src/utilities/awsMulter';
import { UserTypeService } from 'src/userType/userType.service';
import { MetricsService } from 'src/metrics/metrics.service';

@Controller('user')
export class UserController {
  constructor(
    private service: UserService,
    private statusTypeService: StatusTypeService,
    private personService : PersonService,
    private documentTypeService : DocumentTypeService,
    private userTypeService : UserTypeService,
    private serviceStatusType : StatusTypeService,
    private serviceMetrics: MetricsService
  ){}

  @Get()
  async list(){
    try {
      return await this.service.list();
    } catch (error) {
      throw error;
    }
  }
  @Get('populate')
  async listWhitPopulate(){
    try {
      return await this.service.listWithParamsPopulate({});
    } catch (error) {
      throw error;
    }
  }
  @Get('listAsync')
  async listAsync(){
    try {
      return await this.service.listWithParamsPopulateAsync({});
    } catch (error) {
      throw error;
    }
  }

  @Get('getPopulate/:id')
  async getPopulate(@Param('id') id : any){
    try {
      return await this.service.findIdPopulate(id);
    } catch (error) {
      throw error;
    }
  }
  @Get('getPopulateV2/:id')
  async getPopulateV2(@Param('id') id : any){
    try {
      return await this.service.findIdPopulateV2(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('listWithParamsPopulate')
  async listWithParamsPopulate(@Body() body: any){
    try {
      
      if(body.username){
        body.username = {$regex: new RegExp(body.username, 'i')};
      }
      console.log("body ",body);
      
      return await this.service.listWithParamsPopulate(body);
    } catch (error) {
      throw new InternalServerErrorException(error);
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
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: memoryStorage(), // Almacenar el archivo en memoria para manejarlo manualmente
  }))
  async create(@Body() body: any, @Req() req: Request,@UploadedFiles() files: Express.Multer.File[]){
    try {
      let objAddress:any = {};
      // console.log("body ",body);
      let personSelected = await this.personService.findOneWithParams({document : body.document});
      // console.log("personSelected ",personSelected);
      if(personSelected &&  personSelected._id){
        body.name = `${personSelected.names || ""} ${personSelected.paternalSurname || ""} ${personSelected.maternalSurname || ""}`;
        body.idPerson = personSelected._id;
        let personUserSelected = await this.service.findOneWithParams(
          {
            "$or" : [
              { idPerson: personSelected?._id },
              { idStatusType: personSelected?._id.toString()},
            ]

          }
        );
        if(personUserSelected && personUserSelected._id){
          throw ('Esta persona ya tiene un usuario');
        }
      }
      console.log("personSelected ",personSelected);
      
      if(!body.idDistrict){
        delete body.idDistrict
      }

      const statusTypePerson = await this.statusTypeService.findOneWithParams({name:"Activo", proccess: "Person"});
      if(!statusTypePerson) throw ('Tipo de Estado Activo no encontrado..!');

      const documentTypePerson = await this.documentTypeService.findOneWithParams({name:"DNI", proccess: "Identificación"});
      if(!documentTypePerson) throw ( 'Tipo de Documento DNI no encontrado..!');
      if(!personSelected || !personSelected._id){
          personSelected = await this.personService.create({
            names : `${body.names}`.trim(),
            maternalSurname : `${body.maternalSurname}`.trim(),
            paternalSurname : `${body.paternalSurname}`.trim(),
            document : body.document,
            idStatusType : statusTypePerson._id,
            documentTypeId : documentTypePerson._id,
            birthdate : body.birthdate || null
            });
          if(!personSelected || !personSelected._id){
            throw ('Error al registrar datos de la persona');
          }
          body.idPerson = personSelected._id
          body.name = `${personSelected.names || ""} ${personSelected.paternalSurname || ""} ${personSelected.maternalSurname || ""}`;

      }
      if(!body.idStatusType){
        const statusType = await this.statusTypeService.findOneWithParams({name:"Activo", proccess: "User"});
        if(!statusType) throw ('Tipo de Estado Activo no encontrado..!');
        body.idStatusType = statusType?._id;
      }else{
        body.idStatusType = new mongoose.Types.ObjectId(body?.idStatusType);
      }
      if(!body.idUserType){
        // const userType = await this.statusTypeService.findOneWithParams({name:"Activo", proccess: "User"});
        // if(!userType) throw 'Tipo de Estado Activo no encontrado..!';
        // body.idStatusType = userType?._id;
      }else{
        body.idUserType = new mongoose.Types.ObjectId(body?.idUserType);
      }

      if(body.password){
        const clavEncriptada = await bcrypt.hash((body.password), 10);
        body.password = clavEncriptada;
      }

      if(body.specs){
        body.specs = JSON.parse(body.specs);
      }

      if(body.addresses){
        body.addresses = JSON.parse(body.addresses);
      }



      if(body.idCompany && body.idSite){
        body.userSite = [
          {
            idCompany : new mongoose.Types.ObjectId(body.idCompany),
            idSite : new mongoose.Types.ObjectId(body.idSite),
            webAccess : body.webAccess || "localhost"
          }
        ];
      }

      if(files?.length > 0){
        // let conpany = await this.companyService.findId(body.idCompany.toString());
        let folderBase = body.username;
        const verify = await verifyFolder(folderBase);
        if (verify.exists == false) {
          const folder = await createFolder(folderBase);
          if (!folder.success) {
            return folder.message;
          }
        }

        let folder2 = `${folderBase}/USER`;
        const verify2 = await verifyFolder(folder2);
        if (verify2.exists == false) {
          const folder = await createFolder(folder2);
          if (!folder.success) {
            return folder.message;
          }
        }

        let params = { files, destinationPath: folder2 + "/", };
        const resFiles: any = await uploadFileS3Many(params)
        if (resFiles.success) {
          const promiseResult = resFiles?.data?.map(async (item: any, index: number) => {
            return {
              url: item.location,
              orden: index + 1,
              fileType: item.fileType,
              size: item.size,
            }
          })

          let filesRegister = await Promise.all(promiseResult);
          body.images = filesRegister;
        }
      }

      
      const response = await this.service.create(body);
      return response
    } catch (error) {
      console.log("error",error);
      throw new InternalServerErrorException(error);
    }
  }

  @Post('addSite')
  async addSite(@Body() body: any){
    try {
      console.log("body ",body);
      const response =  await this.service.addSite(body.idUser, body);
      console.log("response ",response);
      if(!response) throw ('Elemento no encontrado..!');
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Put(':id')
  async update(@Param('id')  id : string, @Body() body: UpdateUserDto, @Req() req: Request){
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

  @Put('userUpdate/:id')
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: memoryStorage(), // Almacenar el archivo en memoria para manejarlo manualmente
  }))
  async updateV2(@Body() body: any, @Param('id') id : string ,@Req() req: Request,@UploadedFiles() files: Express.Multer.File[]){
    try {
      let objPerson:any = {};
      let objUser : any = {};

      let userSelected = await this.service.findId(id);
      if(!userSelected ||  !userSelected._id){
        throw 'El registro de este usuario no existe'
      }
      let personSelected = await this.personService.findId(userSelected.idPerson.toString());
      if(!personSelected ||  !personSelected._id){
        throw 'El registro de la persona relacionada a este usuario no existe'
      }

      if(body.documentTypeId){
        objPerson.documentTypeId = new mongoose.Types.ObjectId(body.documentTypeId);
      }
      if(body.names){
        objPerson.names = body.names?.trim();
      }
      if(body.maternalSurname){
        objPerson.maternalSurname = body.maternalSurname?.trim();
      }
      if(body.paternalSurname){
        objPerson.paternalSurname = body.paternalSurname?.trim();
      }
      if(body.document){
        objPerson.document = body.document?.trim();
      }
      if(body.birthdate){
        objPerson.birthdate = body.birthdate;
      }
      if(personSelected || personSelected._id){
          personSelected = await this.personService.update(userSelected.idPerson.toString(),objPerson);
          if(!personSelected || !personSelected._id){
            throw new InternalServerErrorException('Error al Actualizar datos de la persona');
          }
          objUser.name = `${personSelected.names || ""} ${personSelected.paternalSurname || ""} ${personSelected.maternalSurname || ""}`;
      }

      if(!body.idUserType){
        const userType = await this.userTypeService.findOneWithParams({name:"Default"});
        if(!userType) throw 'Tipo de Usuario Default no encontrado..!';
        objUser.idUserType = userType?._id;
      }else{
        objUser.idUserType = new mongoose.Types.ObjectId(body?.idUserType);
      }

      if(body.username){
        objUser.username = body.username;
      }
      if(body.password){
        const clavEncriptada = await bcrypt.hash((body.password), 10);
        objUser.password = clavEncriptada;
      }

      if(body.specs){
        objUser.specs = JSON.parse(body.specs);
      }
      if(body.email){
        objUser.email = body.email;
      }
      if(body.telephone){
        objUser.telephone = body.telephone;
      }

      if(body.addresses){
        objUser.addresses = JSON.parse(body.addresses);
      }

      if(files?.length > 0){
        // let conpany = await this.companyService.findId(body.idCompany.toString());
        let folderBase = body.username;
        const verify = await verifyFolder(folderBase);
        if (verify.exists == false) {
          const folder = await createFolder(folderBase);
          if (!folder.success) {
            return folder.message;
          }
        }

        let folder2 = `${folderBase}/USER`;
        const verify2 = await verifyFolder(folder2);
        if (verify2.exists == false) {
          const folder = await createFolder(folder2);
          if (!folder.success) {
            return folder.message;
          }
        }

        let params = { files, destinationPath: folder2 + "/", };
        const resFiles: any = await uploadFileS3Many(params)
        if (resFiles.success) {
          const promiseResult = resFiles?.data?.map(async (item: any, index: number) => {
            return {
              url: item.location,
              orden: index + 1,
              fileType: item.fileType,
              size: item.size,
            }
          })

          let filesRegister = await Promise.all(promiseResult);
          objUser.images = filesRegister.concat(userSelected.images || []);
        }
      }

      let response = await this.service.update(id,objUser);
      return response;
    } catch (error) {
      console.log("error",error);
      throw error
    }
  }

  @Put('changeStatus/:id')
  async changeStatus(@Body() body: any, @Param('id') id : string ,@Req() req: Request){
    try{
      let status = "";
      let valid = body.checked || "true";

      if(valid == "false"){
        console.log("vaslidfalse");
        status = 'Inactivo';
      }

      if(valid == "true"){
        console.log("vaslidfalse");
        status = 'Activo';

      }
      console.log("status",status);

      let statusTypeSelected = await this.statusTypeService.findOneWithParams({name : status, proccess : "User"});
      if(!statusTypeSelected){
        throw 'No existe el estado'
      }

      let userUpdated = await this.service.update(id,{idStatusType : statusTypeSelected._id});
      return userUpdated;

    }catch(error){
      console.log("error",error);
      throw error
    }
  }

  @Put('addAddress/:id')
  async addAddress(@Body() body: any, @Param('id') id : string ,@Req() req: Request){
    try{
      let addresses:any = [];
      let userSelected = await this.service.findId(id);
      if(!userSelected){throw 'Usuario no encontrado'}

      if(userSelected.addresses){
        addresses = userSelected.addresses;
      }
      
      addresses.push(body);
      let userUpdated = await this.service.update(id,{addresses : addresses});
      return userUpdated;

    }catch(error){
      console.log("error",error);
      throw error
    }
  }

  @Put('updateUserProfile/:id')
  async updateUserProfile(@Body() body: any, @Param('id') id : string ,@Req() req: Request){
    try{
      let addresses:any = [];
      let userSelected = await this.service.findId(id);
      if(!userSelected){throw 'Usuario no encontrado'}
      let data:any = {};
      let personSelected = await this.personService.findId(userSelected.idPerson.toString());
      if(!personSelected){throw 'Persona no encontrado'}

      if(body.names){
        data.names = body.names;
      }
      if(body.paternalSurname){
        data.paternalSurname = body.paternalSurname;
      }
      if(body.maternalSurname){
        data.maternalSurname = body.maternalSurname;
      }
      if(body.document){
        data.document = body.document;
      }
      if(body.telephone){
        data.telephone = body.telephone;
      }
      if(body.birthdate){
        data.birthdate = new Date(body.birthdate);
    }
      if(body.email){
        data.email = body.email;
      }


      let personUpdated = await this.personService.update(userSelected.idPerson.toString(),data);
      if(!personUpdated){
        throw "Error al actualizar datos";
      }

      data.name = `${personUpdated.names || ""} ${personUpdated.paternalSurname || ""} ${personUpdated.maternalSurname || ""}`;

      let userUpdated = await this.service.update(id,data);
      if(!personUpdated){
        throw "Error al actualizar Usuario";
      }
      return userUpdated;

    }catch(error){
      console.log("error",error);
      throw new InternalServerErrorException(error);
    }
  }

  @Put('changePassword/:id')
  async changePassword(@Body() body: any, @Param('id') id : string ,@Req() req: Request){
    try{
      let userSelected = await this.service.findId(id);
      if(!userSelected){throw 'Usuario no encontrado'}
      let data:any = {};
 
      if(!body.password){
        throw 'Clave no ingresada'
      }

      const validation = await bcrypt.compare(body.password, userSelected.password);
      if(!validation){
        throw ('Clave incorrecta');
      }

      if(body.username){
        data.username = body.username;
      }
      if(body.newPassword){
        let passwordHash = await bcrypt.hash((body.newPassword), 10);
        data.password = passwordHash;
      }
 

      let userUpdated = await this.service.update(id,data);
      if(!userUpdated){
        throw "Error al actualizar Usuario";
      }
      console.log("userUpdate",userSelected);
      return userUpdated;

    }catch(error){
      console.log("error",error);
      throw new InternalServerErrorException(error);
    }
  }

  @Put('changeAddressSelected/:id')
  async changeAddressSelected(@Body() body: any, @Param('id') id : string ,@Req() req: Request){
    try{
      let addresses:any = [];
      let indexSelected = -1;
      let userSelected = await this.service.findId(id);
      if(!userSelected){throw 'Usuario no encontrado'}
 
      if(userSelected.addresses){
        addresses = userSelected.addresses;
      }
      if(body.index){
        indexSelected = parseFloat(body.index);
      }

      if(!addresses[indexSelected]){
        throw 'Dirección no encontrada';
      }

      var addressesNew:any = [];

      addresses.map((a:any,i:any)=>{
        let indexselected = indexSelected;
        let selected = false;
        if(i == indexselected){
          selected = true;
        }
        var temp = a;
        temp.selected = selected
        addressesNew.push(temp);
      });

      let userUpdated = await this.service.update(id,{addresses : addressesNew});
      if(!userUpdated){
        throw "Error al actualizar Usuario";
      }
      
      // console.log("userUpdate",userSelected);

      return userUpdated;

    }catch(error){
      console.log("error",error);
      throw new InternalServerErrorException(error);
    }
  }
  @Put('deleteddressSelected/:id')
  async deleteddressSelected(@Body() body: any, @Param('id') id : string ,@Req() req: Request){
    try{
      let addresses:any = [];
      let addressesOriginal:any = [];
      let indexSelected = -1;
      let userSelected = await this.service.findId(id);
      if(!userSelected){throw 'Usuario no encontrado'}
 
      if(userSelected.addresses){
        addresses = userSelected.addresses;
        addressesOriginal = userSelected.addresses;
      }
      if(body.index){
        indexSelected = parseFloat(body.index);
      }

      if(!addresses[indexSelected]){
        throw 'Dirección no encontrada';
      }

      // addresses = addresses.map((a:any,i:any)=>{
      //   let indexselected = indexSelected;
      //   if(i != indexselected){
      //     return a;
      //   }
      // });
      addresses.splice(indexSelected,1);

      // console.log("indexSelected",indexSelected);
      // console.log("userSelected.addresses.length-1",userSelected.addresses.length-1);
      // if(indexSelected == (addressesOriginal.length-1)){
      //   if(addressesOriginal[indexSelected-1]){
      //     addressesOriginal[indexSelected-1].selected = true;
      //     addresses[addresses.length-1] = addressesOriginal[indexSelected-1];
      //   }
      // }
  

      let userUpdated = await this.service.update(id,{addresses : addresses});
      if(!userUpdated){
        throw "Error al actualizar Usuario";
      }
      console.log("userUpdate",userSelected);
      return userUpdated;

    }catch(error){
      console.log("error",error);
      throw new InternalServerErrorException(error);
    }
  }

  @Put('addFavorite/:id')
  async addFavorite(@Body() body: any, @Param('id') id : string ,@Req() req: Request){
    try{
      let favorites:any = [];
      let favorite:any = {};
      let userSelected = await this.service.findId(id);
      if(!userSelected){throw 'Usuario no encontrado'}

      if(body.idProduct){
        favorite.idProductSite = new mongoose.Types.ObjectId(body.idProduct);
      }

      if(userSelected.favorites){
        favorites = userSelected.favorites;
      }
      
      console.log("favorite",favorite);
      let favoriteSelected = favorites.find((e:any)=>{return e.idProductSite.toString() == favorite.idProductSite.toString()});
      if(favoriteSelected){
        throw 'Este producto ya esta como favorito'
      }
      favorites.push(favorite);

      let userUpdated = await this.service.update(id,{favorites : favorites});
      return userUpdated;

    }catch(error){
      console.log("error",error);
      throw new InternalServerErrorException(error);
    }
  }
  @Put('deleteFavorite/:id')
  async deleteFavorite(@Body() body: any, @Param('id') id : string ,@Req() req: Request){
    try{
      let favorites:any = [];
      let indexSelected = -1;
      let userSelected = await this.service.findId(id);
      if(!userSelected){throw 'Usuario no encontrado'}

      if(body.index){
        indexSelected = parseInt(body.index);
      }

      if(userSelected.favorites){
        favorites = userSelected.favorites;
      }

      if(!favorites[indexSelected]){
        throw 'Ese elemento no existe'
      }
      
      favorites.splice(indexSelected,1);

      let userUpdated = await this.service.update(id,{favorites : favorites});
      return userUpdated;

    }catch(error){
      console.log("error",error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get('getFavorites/:id')
  async getFavorites(@Body() body: any, @Param('id') id : string ,@Req() req: Request){
    try{
      let userSelected = await this.service.findIdPopulateV2(id);
      if(!userSelected){throw 'Usuario no encontrado'}
      return userSelected.favorites
      
    }catch(error){
      console.log("error",error);
      throw new InternalServerErrorException(error);
    }
  }

  @Post('createAPK')
  async createAPK(@Body() body: any, @Req() req: Request){
      try {
        const responseStatusType = await this.serviceStatusType.findOneWithParams( { name: 'Activo' })
        const passwordEncrypted = await bcrypt.hash(body.password, 10);
        if( passwordEncrypted ) body.password = passwordEncrypted;
        if( responseStatusType ) body.idStatusType = responseStatusType?._id;
        
        const response = await this.service.create(body);

        if(response) {
          const dataMetrics : any = {
            name: 'User',
            description: 'Registró un usuario',
            type: 'Registrar',
            idStatusType: responseStatusType?._id
          }

          if(body.idUser) {
            dataMetrics.idUser = body?.idUser
          }
          
          await this.serviceMetrics.create(dataMetrics)

          return response;
        }

        return response
    } catch (error) {
      throw error
    }
  }

  
}
