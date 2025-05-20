import mongoose from 'mongoose';
import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, InternalServerErrorException } from '@nestjs/common';
import { OrderService } from './order.service';
import { StatusTypeService } from 'src/statusType/statusType.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { PaymentMethodService } from 'src/paymentMethod/paymentMethod.service';
import { DeliveryMethodService } from 'src/deliveryMethod/deliveryMethod.service';
import { DocumentSerieService } from 'src/documentSeries/documentSerie.service';
import { ProductService } from 'src/product/product.service';
import { CurrencyTypeService } from 'src/currencyType/currencyType.service';
import { ProductSiteService } from 'src/productSite/productSite.service';
import { ProductPresentationService } from 'src/productPresentation/productPresentation.service';
import { UserService } from 'src/user/user.service';
import { PersonService } from 'src/person/person.service';

import * as bcrypt from 'bcryptjs'
import { CompanyService } from 'src/company/company.service';
import { SiteService } from 'src/site/site.service';
import { DocumentTypeService } from 'src/documentType/documentType.service';
import { catchError, lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { calculateDiscount } from 'src/utilities/fuctions';
import axios from 'axios';
import { DepartamentService } from 'src/departament/departament.service';


@Controller('order')
export class OrderController {
  constructor(
    private service: OrderService,
    private statusTypeService: StatusTypeService,
    private paymentMethodService: PaymentMethodService,
    private deliveryMethodService: DeliveryMethodService,
    private documentTypeService: DocumentTypeService,
    private documentSerieService: DocumentSerieService,
    private productService : ProductService,
    private productSiteService : ProductSiteService,
    private productPresentationService : ProductPresentationService,
    private currencyTypeService : CurrencyTypeService,
    private personService : PersonService,
    private userService : UserService,
    private companyService : CompanyService,
    private siteService : SiteService,
    private httpService : HttpService,
    private departamentService : DepartamentService,
    
  ){}

  @Get()
  async list(){
    try {
      return await this.service.list();
    } catch (error) {
      throw error;
    }
  }

  @Post('findWithParamsPopulate')
  async findWithParamsPopulate(@Body() body: any, @Req() req: Request) {
    try {
      const { page = 0, limit = 99 } = body;
  
      const query: any = {};
  
      if (body?.idProduct) {
        query["detail.idProduct"] = {
          $in: [
            new mongoose.Types.ObjectId(body.idProduct),
            body.idProduct
          ]
        };
        delete body.idProduct;
      }
  
      if (body.idUser) {
        query.$or = query.$or || []; 
        query.$or.push(
          { idUser: new mongoose.Types.ObjectId(body.idUser) },
          { idUser: body.idUser }
        );
        delete body.idUser;
      }
  
      // Manejo de idStatusType
      if (body.idStatusType) {
        query.$or = query.$or || [];
        query.$or.push(
          { idStatusType: new mongoose.Types.ObjectId(body.idStatusType) },
          { idStatusType: body.idStatusType }
        );
        delete body.idStatusType;
      }
  
      if (body.issueDateStart || body.issueDateEnd) {
        query.issueDate = {};

    
        
        
        if (body.issueDateStart) {
          query.issueDate.$gte = new Date(`${body.issueDateStart}T05:00:00.000Z`);
        }
        
        if (body.issueDateEnd) {

          const endOfDay = new Date(`${body.issueDateEnd}T04:59:59.999Z`);
          endOfDay.setDate(endOfDay.getDate() + 1);

          query.issueDate.$lte = endOfDay;
        }
  
        delete body.issueDateStart;
        delete body.issueDateEnd;
      }
  
      console.log("query.issueDate ",query.issueDate);
      
      // Llamada al servicio
      const response = await this.service.listWithParamsAsyncPopulate(query);
  
      if (!response || response.length === 0) {
        throw new InternalServerErrorException('Elemento no encontrado..!');
      }
  
      return response;
    } catch (error) {
      console.error("Error en findWithParamsPopulate:", error);
      throw new InternalServerErrorException(error.message || error);
    }
  }
  
  @Get(':id')
  async findId(@Param('id') id:string){
    try {
      const response =  await this.service.findId(id);
      if(!response) throw ('Elemento no encontrado..!');
      // console.log("response ",response);
      
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('findIdPopulate/:id')
  async findIdPopulate(@Param('id') id:string){
    try {
      const response =  await this.service.findIdPopulate(id);
      if(!response) throw ('Elemento no encontrado..!');
      // console.log("response ",response);
      
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('findIdPopulateDetailOrder/:id')
  async findIdPopulateDetailOrder(@Param('id') id:string){
    try {
      const response =  await this.service.findIdPopulateDetailOrder(id);
      if(!response) throw ('Elemento no encontrado..!');
      // console.log("response ",response);
      
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  
  @Post()
  async create(@Body() body: CreateOrderDto, @Req() req: Request){
    try {
      if(!body.idStatusType){
        const statusType = await this.statusTypeService.findOneWithParams({name:"Solicitud Recibida", proccess: "Order"});
        if(!statusType) throw 'Tipo de Estado Solicitud Recibida no encontrado..!';
        body.idStatusType = statusType?._id;
      }else{
        body.idStatusType = new mongoose.Types.ObjectId(body?.idStatusType);
      }

      if(!body.idStatusPay){
        const statusPay = await this.statusTypeService.findOneWithParams({name:"Pendiente", proccess: "Pay"});
        if(!statusPay) throw 'Tipo de Estado Pendiente no encontrado..!';
        body.idStatusPay = statusPay?._id;
      }else{
        body.idStatusPay = new mongoose.Types.ObjectId(body?.idStatusPay);
      }

      if(!body.idPaymentMethod){
        const paymentMethod = await this.paymentMethodService.findOneWithParams({name:"Online"});
        if(!paymentMethod) throw 'Metodo de pago Online no encontrado..!';
        body.idPaymentMethod = paymentMethod?._id;
      }else{
        body.idPaymentMethod = new mongoose.Types.ObjectId(body?.idPaymentMethod);
      }

      if(!body.idDeliveryMethod){
        const deliveryMethod = await this.deliveryMethodService.findOneWithParams({name:"Delivery"});
        if(!deliveryMethod) throw 'Metodo de pago Default no encontrado..!';
        body.idDeliveryMethod = deliveryMethod?._id;
      }else{
        body.idDeliveryMethod = new mongoose.Types.ObjectId(body?.idDeliveryMethod);
      }
 
      if(body?.idUser){
        body.idUser = new mongoose.Types.ObjectId(body?.idUser);
      }

      body?.detail.map((ojb)=>{
        ojb.idProduct = new mongoose.Types.ObjectId(ojb?.idProduct);
      })
      console.log("2", body)

      const documentSerieData = await this.documentSerieService.findId(body.idDocumentSerie);
      if(!documentSerieData) throw ('Serie de documento no encontrado...!');
      body.idDocumentSerie = documentSerieData?._id;
      body.serie = documentSerieData?.serie;
      body.correlative = documentSerieData?.correlative; 

      const response = await this.service.create(body);

      const updatedocumentSerie = await this.documentSerieService.updateCorrelative(body.idDocumentSerie, (response?.correlative+1));
      if(!updatedocumentSerie) throw ('Error al actualizar el correlativo!');

      return response
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('productBestSelling')
  async productBestSelling(@Body() body: any, @Req() req: Request) {
      try {
          const currentDate = new Date();
          const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
  
          const response = await this.service.listWithParamsAsyncPopulate({
              issueDate: {
                  $gte: startOfMonth,
                  $lte: endOfMonth
              }
          });
          
          const details = response?.flatMap((item: any) => item.detail || []) || [];

          const groupProduct: any[] = [];

          details.forEach((val: any) => {
            let idProductSite: string | undefined;
            let quantity = val?.quantity || 0;
            let name = val?.name || '';
          
            if (val?.idProductSite) {
              idProductSite = val.idProductSite._id?.toString();
            } else{
              idProductSite = val.idProductPresentation.idProductSite.toString();
            }
          
            if (idProductSite) {
              const existProduct = groupProduct.find((obj: any) => 
                obj?.idProductSite?.toString() === idProductSite
              );
          
              if (existProduct) {
                existProduct.quantity = (existProduct.quantity || 0) + quantity;
              } else {
                groupProduct.push({
                  idProductSite: idProductSite,
                  quantity,
                  name
                });
              }
            }
          });
          
                        
          return groupProduct;
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }

  @Post('ordersMonth')
  async ordersMonth(@Body() body: any, @Req() req: Request) {
      try {
          const currentDate = new Date();
          const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
  
          const response = await this.service.listWithParamsAsyncPopulate({
              issueDate: {
                  $gte: startOfMonth,
                  $lte: endOfMonth
              }
          });

          return response;
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }

  @Post('productDeliver')
  async productDeliver(@Body() body: any, @Req() req: Request) {
      try {
          const currentDate = new Date();
          const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

          const statusTypeEN = await this.statusTypeService.findOneWithParams({name:"En proceso", proccess: "Order"});
          if(!statusTypeEN) throw 'Tipo de Estado En proceso no encontrado..!';

          const statusTypeET = await this.statusTypeService.findOneWithParams({name:"En tránsito", proccess: "Order"});
          if(!statusTypeET) throw 'Tipo de Estado En tránsito no encontrado..!';

          const statusTypeR = await this.statusTypeService.findOneWithParams({name:"Retrasado", proccess: "Order"});
          if(!statusTypeR) throw 'Tipo de Estado Retrasado no encontrado..!';

          const statusTypeL = await this.statusTypeService.findOneWithParams({name:"Listo para recojo", proccess: "Order"});
          if(!statusTypeL) throw 'Tipo de Estado Listo para recojo no encontrado..!';

          const response = await this.service.listWithParamsAsyncPopulate2({
              issueDate: {
                  $gte: startOfMonth,
                  $lte: endOfMonth
              },
              "$or" : [
                { idStatusType: statusTypeEN?._id },
                { idStatusType: statusTypeEN?._id.toString()},
                { idStatusType: statusTypeET?._id },
                { idStatusType: statusTypeET?._id.toString()},
                { idStatusType: statusTypeR?._id },
                { idStatusType: statusTypeR?._id.toString()},
                { idStatusType: statusTypeL?._id },
                { idStatusType: statusTypeL?._id.toString()},
              ]
          });
        

          return response;
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }
  
  @Post('productReportCalculate')
  async productReportCalculate(@Body() body: any, @Req() req: Request) {
      try {

          const currentDate = new Date();
          
          const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0);
          const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59, 999);
  
          const response = await this.service.listWithParamsAsyncPopulate({
              issueDate: {
                  $gte: startOfDay,
                  $lte: endOfDay
              }
          });

          const total = response.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
  
          return {
            totalDay: total,
            ordersDayCount : response.length
          };

      } catch (error) {
          console.error('Error fetching data:', error);
          throw new Error('Error fetching data');
      }
  }

  @Post('createOrderMovil')
  async createOrderMovil(@Body() body: CreateOrderDto, @Req() req: Request){
    try {
      if(!body.idStatusType){
        const statusType = await this.statusTypeService.findOneWithParams({name:"Solicitud Recibida", proccess: "Order"});
        if(!statusType) throw 'Tipo de Estado Solicitud Recibida no encontrado..!';
        body.idStatusType = statusType?._id;
      }else{
        body.idStatusType = new mongoose.Types.ObjectId(body?.idStatusType);
      }

      if(!body.idStatusPay){
        const statusPay = await this.statusTypeService.findOneWithParams({name:"Pendiente", proccess: "Pay"});
        if(!statusPay) throw 'Tipo de Estado Pendiente no encontrado..!';
        body.idStatusPay = statusPay?._id;
      }else{
        body.idStatusPay = new mongoose.Types.ObjectId(body?.idStatusPay);
      }

      if(!body.idPaymentMethod){
        const paymentMethod = await this.paymentMethodService.findOneWithParams({name:"Online"});
        if(!paymentMethod) throw 'Metodo de pago Online no encontrado..!';
        body.idPaymentMethod = paymentMethod?._id;
      }else{
        body.idPaymentMethod = new mongoose.Types.ObjectId(body?.idPaymentMethod);
      }

      if(!body.idDeliveryMethod){
        const deliveryMethod = await this.deliveryMethodService.findOneWithParams({name:"Delivery"});
        if(!deliveryMethod) throw 'Metodo de pago Default no encontrado..!';
        body.idDeliveryMethod = deliveryMethod?._id;
      }else{
        body.idDeliveryMethod = new mongoose.Types.ObjectId(body?.idDeliveryMethod);
      }

      if(!body.idCurrencyType){
        const currencyType = await this.currencyTypeService.findOneWithParams({ name:"Soles" });
        if(!currencyType) throw 'Metodo de pago Default no encontrado..!';
        body.idCurrencyType = currencyType?._id;
      }else{
        body.idCurrencyType = new mongoose.Types.ObjectId(body?.idCurrencyType);
      }
 
      if(body?.idUser){
        body.idUser = new mongoose.Types.ObjectId(body?.idUser);
      }

      const documentSerieData = await this.documentSerieService.findId(body.idDocumentSerie);
      if(!documentSerieData) throw ('Serie de documento no encontrado...!');
      body.idDocumentSerie = documentSerieData?._id;
      body.serie = documentSerieData?.serie;
      body.correlative = documentSerieData?.correlative;

      const response = await this.service.create(body);

      const updatedocumentSerie = await this.documentSerieService.updateCorrelative(body.idDocumentSerie, (response?.correlative+1));
      if(!updatedocumentSerie) throw ('Error al actualizar el correlativo!');

      return response
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('createOrder')
  async createOrder(@Body() body: any, @Req() req: Request){
    try {
      
      const details = [];

      if(body?.paymentMethod == "Pago Online"){

        if(!body.idStatusPay){
          const statusPay = await this.statusTypeService.findOneWithParams({name:"Pagado", proccess: "Pay"});
          if(!statusPay) throw 'Tipo de Estado Pendiente no encontrado..!';
          body.idStatusPay = statusPay?._id;
        }else{
          body.idStatusPay = new mongoose.Types.ObjectId(body?.idStatusPay);
        }

        if(!body.idStatusType){
          const statusType = await this.statusTypeService.findOneWithParams({name:"Solicitud Recibida", proccess: "Order"});
          if(!statusType) throw 'Tipo de Estado Solicitud Recibida no encontrado..!';
          body.idStatusType = statusType?._id;
        }else{
          body.idStatusType = new mongoose.Types.ObjectId(body?.idStatusType);
        }

      }else if(body?.paymentMethod == "Pago Contra Entrega"){

        if(!body.idStatusPay){
          const statusPay = await this.statusTypeService.findOneWithParams({name:"Pendiente", proccess: "Pay"});
          if(!statusPay) throw 'Tipo de Estado Pendiente no encontrado..!';
          body.idStatusPay = statusPay?._id;
        }else{
          body.idStatusPay = new mongoose.Types.ObjectId(body?.idStatusPay);
        }
        if(!body.idStatusType){
          const statusType = await this.statusTypeService.findOneWithParams({name:"Solicitud Recibida", proccess: "Order"});
          if(!statusType) throw 'Tipo de Estado Solicitud Recibida no encontrado..!';
          body.idStatusType = statusType?._id;
        }else{
          body.idStatusType = new mongoose.Types.ObjectId(body?.idStatusType);
        }

      }


      if(body.listGroupRadioDelivery){
        const deliveryMethod = await this.deliveryMethodService.findOneWithParams({name:body.listGroupRadioDelivery});
        if(!deliveryMethod){
        body.idDeliveryMethod = deliveryMethod?._id;
        }
      }
      if(body.listGroupRadioPay){
        const paymentMethod = await this.paymentMethodService.findOneWithParams({name:body.listGroupRadioPay});
        if(paymentMethod){

          body.idPaymentMethod = paymentMethod?._id;
        }
      }

      if(!body.idPaymentMethod){
        const paymentMethod = await this.paymentMethodService.findOneWithParams({name:"Online"});
        if(!paymentMethod) throw 'Metodo de pago Online no encontrado..!';
        body.idPaymentMethod = paymentMethod?._id;
      }else{
        body.idPaymentMethod = new mongoose.Types.ObjectId(body?.idPaymentMethod);
      }

      if(!body.idDeliveryMethod){
        const deliveryMethod = await this.deliveryMethodService.findOneWithParams({name:"Delivery"});
        if(!deliveryMethod) throw 'Metodo de pago Default no encontrado..!';
        body.idDeliveryMethod = deliveryMethod?._id;
      }else{
        body.idDeliveryMethod = new mongoose.Types.ObjectId(body?.idDeliveryMethod);
      }

      const company = await this.companyService.list();
      if(!company) throw (`No hay empresa ..!`);
      const firstCompany = company[0];
      const site:any = await this.siteService.findOneWithParamsPopulate({idCompany : firstCompany?._id});
      // console.log("site ",site);
      if(!site) throw (`Empresa ${firstCompany?.businessName} no tiene Sede ..!`);
      const firstSite = site;

      body.idSupplierCompany = firstCompany?._id;
      body.idSupplierSite = site?._id;


      if(body?.idDistrict){
        body.idDepartament = new mongoose.Types.ObjectId(body?.idDepartament);
        body.idProvince = new mongoose.Types.ObjectId(body?.idProvince);
        body.idDistrict = new mongoose.Types.ObjectId(body?.idDistrict);
      }else{
        body.idDistrict = site?.idDistrict?._id;
        body.idProvince = site?.idDistrict?.idProvince?._id;
        body.idDepartament = site?.idDistrict?.idProvince?.idDepartament?._id;
        body.address = site?.address;
      }

      // console.log("body ",body);
      // console.log("body.idDistrict ",body.idDistrict);

      if(body?.idUser){
        body.idUser = new mongoose.Types.ObjectId(body?.idUser);
      }else{
        console.log("document: body?.document ", body?.document);
        const personSearch = await this.personService.findOneWithParams({document: body?.document});

        const passwordCrip = await bcrypt.hash((body?.document), 10);

        const statusTypePerson = await this.statusTypeService.findOneWithParams({name:"Activo", proccess: "Person"});
        if(!statusTypePerson) throw 'Tipo de Estado Activo no encontrado..!';

        const statusTypeUser = await this.statusTypeService.findOneWithParams({name:"Activo", proccess: "User"});
        if(!statusTypeUser) throw new NotFoundException('Tipo de Estado Activo no encontrado..!');

        if(!personSearch){
          console.log("aca");
          
          const personCreate = await this.personService.create({
            document : body?.document,
            names : body?.names,
            idStatusType : statusTypePerson?._id,
            documentTypeId : new mongoose.Types.ObjectId(body?.documentTypeId),
          });

          const userCreate = await this.userService.create({
            idPerson : personCreate?._id,
            name : body?.names,
            username : body?.names,
            password : passwordCrip,
            telephone : body?.telephone,
            email : body?.email,
            userSite : [{
              webAccess: body?.webAccess,
              idCompany: firstCompany?._id,
              idSite: firstSite?._id,
            }],
            addresses : [{
              idDepartament : body.idDepartament,
              idProvince : body.idProvince,
              idDistrict : body.idDistrict,
              address : body.address,
              orden : 0,
              selected :true
            }],
            idStatusType : statusTypeUser?._id,
          })

          body.idUser = userCreate?._id;
          body.idClientUser	 = userCreate?._id;
        }else{
          console.log("aca2");
          const user = await this.userService.findOneWithParams({idPerson : personSearch?._id});
          if(!user){
            console.log("aca3");
  
            const userCreate = await this.userService.create({
              idPerson : personSearch?._id,
              name : body?.names,
              username : body?.names,
              password : passwordCrip,
              telephone : body?.telephone,
              email : body?.email,
              userSite : [{
                webAccess: body?.webAccess,
                idCompany: firstCompany?._id,
                idSite: firstSite?._id,
              }],
              addresses : [{
                idDepartament : body.idDepartament,
                idProvince : body.idProvince,
                idDistrict : body.idDistrict,
                address : body.address,
                orden : 0,
                selected :true
              }],
              idStatusType : statusTypeUser?._id,
            })
  
            body.idUser = userCreate?._id;
            body.idClientUser	 = userCreate?._id;
          }else{
          console.log("aca4");
          const userWeb = user?.userSite?.find((obj)=>obj?.webAccess == body?.webAccess)
            if(!userWeb?.webAccess){
              const response =  await this.userService.addSite(
                user?._id.toString(), 
                {
                  webAccess: body?.webAccess,
                  idCompany: firstCompany?._id,
                  idSite: firstSite?._id,
                }
              );
              body.idUser = response?._id;
              body.idClientUser	 = response?._id;
            }else{
              body.idUser = user?._id;
              body.idClientUser	 = user?._id;
            }
          }

        }
        body.name = body?.names,

        console.log("personSearch ",personSearch);
        
        // return personSearch;
      }

      if(!body.commission){
        body.commission = 0.00;
      }
      if(!body.charge){
        body.charge = 0.00;
      }
      if(!body.tax){
        body.tax = 0.00;
      }

      if(body.items){
        for (const e of body.items || []) {

          if(e?.table == "" || e?.table == undefined || e?.table == null || e?.table == "productSite"){
            const response:any = await this.productSiteService.findIdPopulate(e.idProductSite);
            // const price = response?.discount > 0 ? calculateDiscount(response?.unitPrice, response?.typeDiscount, response?.discount) : response?.unitPrice;
            const subTotal = (response?.discount > 0 ? calculateDiscount(response?.unitPrice, response?.typeDiscount, response?.discount) : response?.unitPrice) * e?.quantity;
            details.push({
              codeA : response.code,
              unitMeasure : response?.idUnitMeasure?.name,
              bool: "0",
              idProductSite: new mongoose.Types.ObjectId(e.idProductSite),
              name: response.name,
              typeDiscount: response.typeDiscount,
              discount: response.discount,
              unitValue: response?.unitPrice,
              unitPrice: response?.unitPrice,
              quantity: e.quantity,
              subTotal: subTotal,
              total: subTotal,
            });
          }else if(e?.table == "productPresentation"){
            const response:any =  await this.productPresentationService.findIdPopulate(e.idProductPresentation);
            // const price = response?.discount > 0 ? calculateDiscount(response?.unitPrice, response?.typeDiscount, response?.discount) : response?.unitPrice;
            const subTotal = (response?.discount > 0 ? calculateDiscount(response?.unitPrice, response?.typeDiscount, response?.discount) : response?.unitPrice) * e?.quantity;
            details.push({
              codeA : response?.code,
              unitMeasure : response?.idProductSite?.idUnitMeasure?.name,
              bool: "0",
              idProductPresentation: new mongoose.Types.ObjectId(e.idProductPresentation),
              name: response.name,
              typeDiscount: response.typeDiscount || "1",
              discount: response.discount,
              unitValue: response?.unitPrice,
              unitPrice: response?.unitPrice,
              quantity: e.quantity,
              subTotal: subTotal,
              total: subTotal,
            });
          }else{
            const responsePre:any =  await this.productPresentationService.findOneWithParamsPopulate({'subPresentation._id': new mongoose.Types.ObjectId(e.idProductSubPresentation)});
            const newArray:any = responsePre?.subPresentation
            const response =  newArray?.find((obj:any)=>obj?._id == e.idProductSubPresentation)
            // const price = response?.discount > 0 ? calculateDiscount(response?.unitPrice, response?.typeDiscount, response?.discount) : response?.unitPrice;
            const subTotal = (response?.discount > 0 ? calculateDiscount(response?.unitPrice, response?.typeDiscount, response?.discount) : response?.unitPrice) * e?.quantity;
            details.push({
              codeA : response?.code,
              unitMeasure : responsePre?.idProductSite?.idUnitMeasure?.name,
              bool: "0",
              idProductPresentation: new mongoose.Types.ObjectId(responsePre._id),
              idProductSubPresentation: new mongoose.Types.ObjectId(e.idProductSubPresentation),
              name: response.name,
              typeDiscount: response.typeDiscount || "1",
              discount: response.discount,
              unitValue: response?.unitPrice,
              unitPrice: response?.unitPrice,
              quantity: e.quantity,
              subTotal: subTotal,
              total: subTotal,
            });
          }
          
        }
      }
      console.log("items", body.items)
      console.log("details", details)

      if(details.length > 0){
        body.detail = details;
      }

      if(!body.idCurrencyType){
        const currencyType = await this.currencyTypeService.findOneWithParams({name:"Soles", proccess: "Default"});
        if(!currencyType) throw 'Tipo de Moneda Soles no encontrado..!';
        body.idCurrencyType = currencyType?._id;
      }else{
        body.idCurrencyType = new mongoose.Types.ObjectId(body?.idCurrencyType);
      }

      if(body.idCompanyFacturation){
        body.idCompanyFacturation = new mongoose.Types.ObjectId(body?.idCompanyFacturation);
      }

      const documentSerieData = await this.documentSerieService.findId(body.idDocumentSerie);
      if(!documentSerieData) throw ('Serie de documento no encontrado...!');
      body.idDocumentSerie = documentSerieData?._id;
      body.serie = documentSerieData?.serie;
      body.correlative = documentSerieData?.correlative;

      // const documentSerieDataFacturation = await this.documentSerieService.findId(body.idDocumentSerieFacturation);
      // if(!documentSerieDataFacturation) throw ('Serie de documento Facturacion no encontrado...!');
      // body.idDocumentSerieFacturation = documentSerieDataFacturation?._id;
      // body.serieFacturation = documentSerieDataFacturation?.serie;
      // body.correlativeFacturation = documentSerieDataFacturation?.correlative;

      // console.log("data ",
      //   {
      //     amount: body?.total * 100,
      //     currency_code: 'PEN',
      //     email: 'richard@piedpiper.com',
      //     source_id: body?.tokenCulqi,
      //     capture: true,
      //     description: 'Prueba',
      //     installments: 2,
      //     metadata: { dni: body?.document },
      //   }
      // ); 
 
      var dataCulqi;
      if(body?.paymentMethod == "Pago Online"){
        const departamentRes = await this.departamentService.findId(body.idDepartament);

        const options = {
          method: 'POST',
          url: 'https://api.culqi.com/v2/charges',
          headers: {
            Authorization: 'Bearer sk_test_5a4d8083b6f54af1',
            'Content-Type': 'application/json'
          },
          data: {
            amount: body?.total * 100,
            currency_code: 'PEN',
            email: body?.email,
            source_id: body?.tokenCulqi,
            capture: true,
            description: `Compra Online ${body.serie} - ${body.correlative}`,
            installments: 2,
            metadata: { dni: body?.document },
            antifraud_details: {
              address: body.address,
              address_city: departamentRes?.name || "lima",
              country_code: "PE",
              first_name: body.names,

              phone_number: body.telephone
            },
          }
        };
        dataCulqi = await axios(options)
        .then(async responseQ => {
          // console.log('Respuesta1:', responseQ);
          console.log('Respuesta2:', responseQ.data);
          return responseQ.data
          
        })
        .catch(error => {
          console.error('Error1:', error);
          console.error('Error2:', error.response?.data);
          return {...error.response?.data, dataError :true}
        });
        console.log("dataCulqi ",dataCulqi);
      }
      // console.log("dataCulqi ",dataCulqi);


      // console.log("body1, ", body)
  
      const response = await this.service.create(body);

      const updatedocumentSerie = await this.documentSerieService.updateCorrelative(body.idDocumentSerie, (response?.correlative+1));
      if(!updatedocumentSerie) throw ('Error al actualizar el correlativo!');

      // const updatedocumentSerieFacturation = await this.documentSerieService.updateCorrelative(body.idDocumentSerieFacturation, (response?.correlativeFacturation+1));
      // if(!updatedocumentSerieFacturation) throw ('Error al actualizar el correlativo!');

      const dataFacturation:any = {
        "contribuyente": {
          "token_contribuyente": body.token_contribuyente, //
          "id_usuario_vendedor": body.id_usuario_vendedor, //
          "tipo_proceso": "prueba",
          "tipo_envio": "inmediato",
        },
        "cliente": {
          "tipo_docidentidad": body.tipo_docidentidad, //,
          "numerodocumento": body?.tipo_documento == "01" ? body.documentE : body.document,
          "nombre": body?.tipo_documento == "01" ? body.namesE : body.names,
          "email": body.email,
          "direccion": body?.tipo_documento == "01" ? body.addressE : body.address,
          "ubigeo": "110207", //falta del front
          "sexo": "",
          "fecha_nac": "",
          "celular": body.telephone
        },
        "cabecera_comprobante": {
          "tipo_documento": body.tipo_documento,
          "moneda": "PEN",
          "idsucursal": body.idsucursal,
          "id_condicionpago": body.id_condicionpago,
          "fecha_comprobante": body.fecha_comprobante,
          "nro_placa": "",
          "nro_orden": `${response?.serie}-${response?.correlative}`,
          "guia_remision": "",
          "descuento_monto": body.descuento_monto || 0, //??
          "descuento_porcentaje": body.descuento_porcentaje || 0, //??
          "observacion": ""
        }
      }
      var detalle:any = [];
      details?.forEach((obj)=>{
        detalle.push({
          "idproducto": 0,
          "codigo": obj?.codeA,
          "afecto_icbper": "no",
          "id_tipoafectacionigv": 10,
          "descripcion": obj?.name,
          "idunidadmedida": obj?.unitMeasure,
          "precio_venta": obj?.unitPrice,
          "cantidad": obj?.quantity
        });
      });

      dataFacturation.detalle = detalle;

      // console.log("==================================================================================================================================");
      // console.log("==================================================================================================================================");
      // console.log("dataFacturation, ",dataFacturation);
      const responseData = await lastValueFrom(this.httpService.get('https://comerciatodo.com/facturacionv8/api/procesar_venta',
        {
          responseType: 'json',
          headers: {
            'Content-Type': 'application/json',
            'Aut' : '5499U1JC4G1EWXAI7LLC5YHZYBITHSHDYV4ZZ',
          },
          data : dataFacturation,
        }).pipe(
          map((response) => {
            return response.data
          }),
          catchError((error) => {
            return `Error al procesar la respuesta: ${error.message}`;
          })
        )
      );
      // console.log("responseData",responseData);

      // console.log("==================================================================================================================================");
      // console.log("==================================================================================================================================");

      // console.log("dataFacturation, ",dataFacturation);
      var responseData2;
      if(body?.delibery?.length > 0 ){

        // body.serieFacturation = updatedocumentSerieFacturation?.serie;
        // body.correlativeFacturation = updatedocumentSerieFacturation?.correlative;
  
        // console.log("body2, ", body)

        //update
        //const response = await this.service.create(body);

        // const updatedocumentSerieFacturation2 = await this.documentSerieService.updateCorrelative(body.idDocumentSerieFacturation, (response?.correlativeFacturation+1));
        // if(!updatedocumentSerieFacturation2) throw ('Error al actualizar el correlativo!');


        dataFacturation.detalle = body?.delibery;
        dataFacturation.cabecera_comprobante.descuento_monto = 0;
        dataFacturation.cabecera_comprobante.descuento_porcentaje = 0;

        responseData2 = await lastValueFrom(this.httpService.get('https://comerciatodo.com/facturacionv8/api/procesar_venta',
          {
            responseType: 'json',
            headers: {
              'Content-Type': 'application/json',
              'Aut' : '5499U1JC4G1EWXAI7LLC5YHZYBITHSHDYV4ZZ',
            },
            data : dataFacturation,
          }).pipe(
            map((response) => {
              return response.data
            }),
            catchError((error) => {
              return `Error al procesar la respuesta: ${error.message}`;
            })
          )
        );
        // console.log("responseData2",responseData2);
      }

      const statusTypeAgotado = await this.statusTypeService.findOneWithParams({name:"Agotado", proccess: "Product"});
      if(!statusTypeAgotado) throw 'Tipo de Estado Publicado no encontrado..!';

      if(body.items){
        for (const e of body.items || []) {

          if(e?.table == "" || e?.table == undefined || e?.table == null || e?.table == "productSite"){
            const responseC = await this.productSiteService.findIdPopulate(e.idProductSite);
            if(!responseC) throw ('Compra completa, Error al buscar el productSite para actualizar el stock!');

            var temp:any  = {
              stock : responseC?.stock - e.quantity
            };
            if((responseC?.stock - e.quantity) <= 0){
              temp.stock = 0
              temp.idStatusType = statusTypeAgotado?._id;
            }

            const resUp = await this.productSiteService.update(e.idProductSite, temp);
            if(!resUp) throw ('Compra completa, Error al actualizar el stock de productSite!');

          }else if(e?.table == "productPresentation"){
            const responseC =  await this.productPresentationService.findIdPopulate(e.idProductPresentation);
            if(!responseC) throw ('Compra completa, Error al buscar el productPresentation para actualizar el stock!');

            var temp1:any  = {
              stock : responseC?.stock - e.quantity
            };

            if((responseC?.stock - e.quantity) <= 0){
              temp1.stock = 0
              temp1.idStatusType = statusTypeAgotado?._id;
            }
            
            const resUp = await this.productPresentationService.update(e.idProductPresentation, temp1);
            if(!resUp) throw ('Compra completa, Error al actualizar el stock de productSite!');

            const responseC2 = await this.productSiteService.findIdPopulate(resUp?.idProductSite.toString());
            if(!responseC2) throw ('Compra completa, Error al buscar el productSite por productPresentation para actualizar el stock!');


            var temp2:any  = {
              stock : responseC2?.stock - e.quantity
            };

            if((responseC2?.stock - e.quantity) <= 0){
              temp2.stock = 0
              temp2.idStatusType = statusTypeAgotado?._id;
            }

            const resUp2 = await this.productSiteService.update(resUp?.idProductSite.toString(), temp2);
            if(!resUp2) throw ('Compra completa, Error al actualizar el stock de productSite por productPresentation!');
            
          }else if(e?.idProductSubPresentation){

            const presntationSelected:any =  await this.productPresentationService.findOneWithParams({'subPresentation._id': new mongoose.Types.ObjectId(e.idProductSubPresentation)});
            if(!presntationSelected) throw ('Compra completa, Error al buscar el productPresentation para actualizar el stock de productSubPresentation!');
            const indexSelected = presntationSelected?.subPresentation?.findIndex((obj)=>obj?._id == e?.idProductSubPresentation);
            
            const subPresentations = presntationSelected.subPresentation  || [];

            let subPresentationSelected = (presntationSelected.subPresentation || [])[indexSelected]
            if(!subPresentationSelected){
              throw 'No existe el registro'
            }

            if((subPresentationSelected?.stock - e.quantity) <= 0){
              subPresentationSelected.stock = 0
              subPresentationSelected.idStatusType = statusTypeAgotado?._id;
            }else{
              subPresentationSelected.stock  = subPresentationSelected?.stock - e.quantity;
            }
            
            // console.log("subPresentations ",subPresentations);
            // console.log("subPresentationSelected ",subPresentationSelected);

            console.log("==============================================");
            
            subPresentations[indexSelected] = subPresentationSelected;
            // console.log("subPresentations ",subPresentations);
            
            
            const presentationUpdated = await this.productPresentationService.updateSinDto(e.idProductPresentation,{subPresentation : subPresentations});
            if(!presentationUpdated) throw ('Compra completa, Error al actualizar el stock de productSubPresentation!');

            var temp2:any  = {
              stock : presntationSelected?.stock - e.quantity
            };

            if((presntationSelected?.stock - e.quantity) <= 0){
              temp2.stock = 0
              temp2.idStatusType = statusTypeAgotado?._id;
            }

            console.log("temp2 ",temp2);
            const resUp2 = await this.productPresentationService.update(presntationSelected?._id.toString(), temp2);
            if(!resUp2) throw ('Compra completa, Error al actualizar el stock de productPresentation por productSubPresentation!');

            const responseC3 = await this.productSiteService.findId(presntationSelected?.idProductSite.toString());
            if(!responseC3) throw ('Compra completa, Error al buscar el productSite por productSubPresentation para actualizar el stock!');

            var temp3:any  = {
              stock : responseC3?.stock - e.quantity
            };

            if((responseC3?.stock - e.quantity) <= 0){
              temp3.stock = 0
              temp3.idStatusType = statusTypeAgotado?._id;
            } 

            console.log("temp3 ",temp3);
            const resUp3 = await this.productSiteService.update(presntationSelected?.idProductSite.toString(), temp3);
            if(!resUp3) throw ('Compra completa, Error al actualizar el stock de productSite por productSubPresentation!');
            
          }
        }
      }


      return {
        responseCulqi : dataCulqi || "false",
        responseBD : response,
        responseF1 : responseData,
        responseF2 : responseData2 || "false",
      };

      
    } catch (error) {
      console.log("errorOrder",error);
      throw new InternalServerErrorException(error);
    }
  }

  @Put(':id')
  async update(@Param('id')  id : string, @Body() body: UpdateOrderDto, @Req() req: Request){
    try {
      body.idUser = new mongoose.Types.ObjectId(body?.idUser);
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
