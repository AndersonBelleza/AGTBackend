import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, InternalServerErrorException, UseInterceptors, UploadedFiles, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { StatusTypeService } from 'src/statusType/statusType.service';
import { UpdateProductSubCategoryDto } from 'src/productSubCategory/dto/updateProductSubCategory.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { CurrencyTypeService } from 'src/currencyType/currencyType.service';
import { ProductTypeService } from 'src/productType/productType.service';
import { ProductCategoryService } from 'src/productCategory/productCategory.service';
import { ProductSubCategoryService } from 'src/productSubCategory/productSubCategory.service';
import { BrandService } from 'src/brand/brand.service';
import mongoose, { mongo } from 'mongoose';
import { memoryStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CompanyService } from 'src/company/company.service';
import { createFolder, uploadFileS3Many, verifyFolder } from 'src/utilities/awsMulter';
import { SiteService } from 'src/site/site.service';
import { ProductSiteService } from 'src/productSite/productSite.service';
import { randomUUID } from 'crypto';
import { generarCodigo } from 'src/utilities';
import { AuthGuard } from 'src/auth/auth.guard';
import { DocumentSerieService } from 'src/documentSeries/documentSerie.service';

@Controller('product')
export class ProductController {
  constructor(
    private service: ProductService,
    private statusTypeService: StatusTypeService,
    private currencyTypeService: CurrencyTypeService,
    private productTypeService: ProductTypeService,
    private productCategoryService: ProductCategoryService,
    private productSubCategoryService: ProductSubCategoryService,
    private brandService: BrandService,
    private companyService : CompanyService,
    private siteService : SiteService,
    private productSiteService : ProductSiteService,
    private documentSerieService : DocumentSerieService
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

  @Get('findIdPopulate/:id')
  async findIdPopulate(@Param('id') id:string){
    try {
      const response =  await this.service.findIdPopulate(id);
      if(!response) throw 'Elemento no encontrado..!';
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('findWithParamsPopulate')
  async findWithParams(@Body() body : any, @Req() req: Request){
    try {

      const { page = 0, limit = null } = body;

      let skip = 0;
      if (page && limit) {
          skip = page * limit;
      }

      if(body.page || body.page == 0 || body.page == "0"){
        delete body.page;
      }
      
      if(body.limit){
        delete body.limit;
      }

      if(body.idStatusType){
        body.idStatusType = new mongoose.Types.ObjectId(body.idStatusType);
      }

      const response = await this.service.listWithParamsAsyncPopulate(skip, limit, body);
      if(!response) throw ('Elemento no encontrado..!');
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('listWithParamsAsyncPopulate')
  async listWithParamsAsyncPopulate(@Body() body : any, @Req() req: Request){
    try{
      const { page = 0, limit = null } = body;
      // console.log("body, ",body); 
      let order = body.orderProducts || "0";
  
      let skip = 0;
      if (page && limit) {
        skip = page * limit;
      }
  
      if(body.idStatusType){
        body.idStatusType = new mongoose.Types.ObjectId(body.idStatusType);
      }
  
      if(body.idProductCategory){
        body.idProductCategory = new mongoose.Types.ObjectId(body.idProductCategory);
      }
  
      if(body.idProductSubCategory){
        body.idProductSubCategory = new mongoose.Types.ObjectId(body.idProductSubCategory);
      }
      if(body.idBrand){
        body.idBrand = new mongoose.Types.ObjectId(body.idBrand);
      }
      
      if(body.limit){
        delete body.limit;
        delete body.page;
        delete body.orderProducts;
      }
  
      if(body.maxPrice){
        body.unitValue = {$lt : parseFloat(body.maxPrice || "0.00")};
        delete body.maxPrice
      }
      // console.log("body, ",body);
      
      const response = await this.service.listWithParamsAsyncPopulate(skip, limit, body, order);
      if(!response) throw ('Elemento no encontrado..!');
      return response;

    }catch(err){
      console.log("err",err);
      throw new InternalServerErrorException(err);
    }
  }

  @Post('searchProduct')
  async searchProduct(@Body() body: any, @Req() req: Request) {
    try {
      const { name } = body;
      var params: any = {};
      var and = [];

      if ( name ) {
        params.name = { $regex: new RegExp(name, 'i') };
      }

      if(body.idBrand){
        and.push({$or : [{idBrand : body.idBrand},{idBrand : new mongoose.Types.ObjectId(body.idBrand)}]});
      }
      if(body.idCompany){
        and.push({$or : [{idCompany : body.idCompany},{idCompany : new mongoose.Types.ObjectId(body.idCompany)}]});
      }

      const response = await this.service.listWithParamsAsyncPopulate2(params);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


  //ACA ESTA INSCRUSTADO PRODUCSITE NO TOCAR
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: memoryStorage(), // Almacenar el archivo en memoria para manejarlo manualmente
  }))
  async create(@Body() body: any, @Req() req: Request, @UploadedFiles() files: Express.Multer.File[],){
    try {
      let filesRegister:any = [];
      let cod = "";
      if(!body.idStatusType){
        const statusType = await this.statusTypeService.findOneWithParams({name:"Publicado", proccess: "Product"});
        if(!statusType) throw 'Tipo de Estado Publicado no encontrado..!';
        body.idStatusType = statusType?._id;
      }else{
        body.idStatusType = new mongoose.Types.ObjectId(body?.idStatusType);
      }
      
      if(!body.idCurrencyType){
        const currencyType = await this.currencyTypeService.findOneWithParams({name:"Soles", proccess: "Default"});
        if(!currencyType) throw 'Tipo de Moneda Soles no encontrado..!';
        body.idCurrencyType = currencyType?._id;
      }else{
        body.idCurrencyType = new mongoose.Types.ObjectId(body?.idCurrencyType);
      }
      
      if(!body.idProductType){
        const productType = await this.productTypeService.findOneWithParams({name:"Bienes"});
        if(!productType) throw 'Tipo de Producto Bienes no encontrado..!';
        body.idProductType = productType?._id;
      }else{
        body.idProductType = new mongoose.Types.ObjectId(body?.idProductType);
      }
      
      if(!body.idProductCategory || !body.idProductSubCategory){
        const productCategory = await this.productCategoryService.findOneWithParams({name:"Default"});
        if(!productCategory) throw 'Categoria de Producto Default no encontrado..!';      
        body.idProductCategory = productCategory?._id;

        const productSubCategory = await this.productSubCategoryService.findOneWithParams({name:"Default", idProductCategory: productCategory?._id});
        if(!productSubCategory) throw 'SubCategoria de Producto Default no encontrado..!';
        body.idProductSubCategory = productSubCategory?._id;
        cod += `${productCategory.name[0]}${productSubCategory.name[0]}${productSubCategory.name[1] || "N"}`.toLocaleUpperCase();
      }else{
        body.idProductCategory = new mongoose.Types.ObjectId(body?.idProductCategory);
        body.idProductSubCategory = new mongoose.Types.ObjectId(body?.idProductSubCategory);

        let categorySelected = await this.productCategoryService.findId(body.idProductCategory);
        let subCategorySelected = await this.productSubCategoryService.findId(body.idProductSubCategory);
        cod += `${categorySelected.name[0]}${subCategorySelected.name[0]}${subCategorySelected.name[1] || "N"}`.toLocaleUpperCase();
      }

      if(!body.idBrand){
        const brandService = await this.brandService.findOneWithParams({name:"Default"});
        if(!brandService) throw 'Marca de Producto Default no encontrado..!';
        body.idBrand = brandService?._id;
      }else{
        body.idBrand = new mongoose.Types.ObjectId(body?.idBrand);
      }

      if(body.idUnitMeasure){
        body.idUnitMeasure = new mongoose.Types.ObjectId(body?.idUnitMeasure);
      }
      

      if(!body.stock){
        body.stock = 0;
      }

      if(body?.idCompany){
        body.idCompany = new mongoose.Types.ObjectId(body?.idCompany);
      }

      if(body.spec){
        body.specs = JSON.parse(body.spec);
      }
      if(body.variants){
        body.variants = JSON.parse(body.variants);
      }

      if(files.length > 0){
        let conpany = await this.companyService.findId(body.idCompany.toString());
        let folderBase = conpany.businessName;
        const verify = await verifyFolder(folderBase);
        if (verify.exists == false) {
          const folder = await createFolder(folderBase);
          if (!folder.success) {
            return folder.message;
          }
        }

        let folder2 = `${folderBase}/PRODUCTO`;
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
              key: item.key,
              name: item.name,
              fileType: item.fileType,
              size: item.size,
              sizeFormatted: item.sizeFormatted,
              url: item.location,
            }
            // orden: index + 1, //este campo hace dificil el proceso de modificar producto en administrador
          })

          filesRegister = await Promise.all(promiseResult);
          body.images = filesRegister;
        }
      }
 
      const response = await this.service.create(body); 
      if(response){
        let sedeDefault:any= {};
        if(!body.idSite){
          sedeDefault = await this.siteService.findOneWithParams({idCompany : body.idCompany.toString()});
        }else{
          sedeDefault = await this.siteService.findId(body.idSite);
        }
        if(sedeDefault){

          let dataProductSite = {
            ...body,
            idProduct : response?._id,
            idSite : sedeDefault?._id,
            unitPrice : body.unitValue,
            unitValue : body.unitValue,
          };
          if(body?.policies){
            dataProductSite.warrantyPolicy = JSON.parse(body.policies);
          }
          let responseProductSite = await this.productSiteService.create(dataProductSite);
          if(body.idDocumentSerie){
            let responseDC = await this.documentSerieService.update(body.idDocumentSerie,{correlative : (parseInt(body.correlative || 0) + 1)});
            if(responseDC && responseDC._id){
              body.correlative = responseDC.correlative;
            }
          }

          return responseProductSite;
        }
      }

    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  @Put(':id')
  async update(@Param('id')  id : string, @Body() body: UpdateProductDto, @Req() req: Request){
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

  //ACA ESTA INSCRUSTADO PRODUCSITE NO TOCAR
  @Put('productUpdate/:id')
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: memoryStorage(), // Almacenar el archivo en memoria para manejarlo manualmente
  }))
  async updateV2(@Body() body: any, @Param('id') id : string,@Req() req: Request, @UploadedFiles() files: Express.Multer.File[],){
    try {
      let filesRegister:any = [];
      let cod = "";

      let producSitetSelected = await this.productSiteService.findId(id);
      if(!producSitetSelected){
        throw 'El producto a editar no existe'
      }

      if(body.variants){
          delete body.variants;
      }
            
      
      if(!body.idProductCategory || !body.idProductSubCategory){
        const productCategory = await this.productCategoryService.findOneWithParams({name:"Default"});
        if(!productCategory) throw 'Categoria de Producto Default no encontrado..!';      
        body.idProductCategory = productCategory?._id;

        const productSubCategory = await this.productSubCategoryService.findOneWithParams({name:"Default", idProductCategory: productCategory?._id});
        if(!productSubCategory) throw 'SubCategoria de Producto Default no encontrado..!';
        body.idProductSubCategory = productSubCategory?._id;
        // cod += `${productCategory.name[0]}${productSubCategory.name[0]}${productSubCategory.name[1] || "N"}`.toLocaleUpperCase();
      }else{
        body.idProductCategory = new mongoose.Types.ObjectId(body?.idProductCategory);
        body.idProductSubCategory = new mongoose.Types.ObjectId(body?.idProductSubCategory);

        let categorySelected = await this.productCategoryService.findId(body.idProductCategory);
        let subCategorySelected = await this.productSubCategoryService.findId(body.idProductSubCategory);
        // cod += `${categorySelected.name[0]}${subCategorySelected.name[0]}${subCategorySelected.name[1] || "N"}`.toLocaleUpperCase();
      }

      if(!body.idBrand){
        const brandService = await this.brandService.findOneWithParams({name:"Default"});
        if(!brandService) throw 'Marca de Producto Default no encontrado..!';
        body.idBrand = brandService?._id;
      }else{
        body.idBrand = new mongoose.Types.ObjectId(body?.idBrand);
      }

      if(body.idUnitMeasure){
        body.idUnitMeasure = new mongoose.Types.ObjectId(body?.idUnitMeasure);
      }
      
      if(body?.idCompany){
         body.idCompany = new mongoose.Types.ObjectId(body?.idCompany);
      }

      if(body.spec){
        body.specs = JSON.parse(body.spec);
      }
      // if(body.variants){
      //   body.variants = JSON.parse(body.variants);
      // }
      if(body.policies){
        body.warrantyPolicy = JSON.parse(body.policies);
      }


      if(files.length > 0){
        let conpany = await this.companyService.findId(body.idCompany.toString());
        let folderBase = conpany.businessName;
        const verify = await verifyFolder(folderBase);
        if (verify.exists == false) {
          const folder = await createFolder(folderBase);
          if (!folder.success) {
            return folder.message;
          }
        }

        let folder2 = `${folderBase}/PRODUCTO`;
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
              key: item.key,
              name: item.name,
              fileType: item.fileType,
              size: item.size,
              sizeFormatted: item.sizeFormatted,
              url: item.location,
            }
          })
          // orden: index + 1, //este campo hace dificil el proceso de modificar producto en administrador

          filesRegister = await Promise.all(promiseResult);
          body.images = producSitetSelected.images.concat(filesRegister);
        }
      }
      console.log("body ",body);
      
      const response = await this.service.update(producSitetSelected.idProduct.toString(),body);
      if(response){
        let dataProductSite = {
          ...body,
          unitPrice : body.unitValue,
          unitValue : body.unitValue,
        };

        delete dataProductSite.sku || "";
        console.log("body ",dataProductSite);

        let responseProductSite = await this.productSiteService.update(id,dataProductSite);
        // console.log("responseProductSite2",responseProductSite);

      }
      // console.log("responseProductSite",response);
      return response
    } catch (error) {
      console.log("errorProduct",error);
      throw new InternalServerErrorException(error)
    }
  }

  
  @Put('changeStatus/:id')
  async changeStatus(@Body() body: any, @Param('id') id : string ,@Req() req: Request){
    try{
      let status = "";
      let valid = body.checked || "true";

      if(valid == "false"){
        console.log("vaslidfalse");
        status = 'Suspendido';
      }

      if(valid == "true"){
        console.log("vaslidfalse");
        status = 'Publicado';

      }
      console.log("status",status);

      let statusTypeSelected = await this.statusTypeService.findOneWithParams({name : status, proccess : "Product"});
      if(!statusTypeSelected){
        throw 'No existe el estado'
      }

      let productUpdated = await this.service.updateSinDto(id,{idStatusType : statusTypeSelected._id});
      return productUpdated;

    }catch(error){
      console.log("error",error);
      throw error
    }
  }

  //NO TOCAR ESTO, SE USA EN LA TIENDA
  @Put('changeStatus2/:id')
  async changeStatus2(@Body() body: any, @Param('id') id : string ,@Req() req: Request){
    try{
      
      // console.log("body?.status",body?.status);

      const statusTypeSelected = await this.statusTypeService.findOneWithParams({name : body?.status, proccess : "Product"});
      // console.log("statusTypeSelected",statusTypeSelected);
      if(!statusTypeSelected){
        throw `No existe el estado ${body?.status}`
      }

      const producSitetSelected = await this.productSiteService.findId(id);
      // console.log("producSitetSelected",producSitetSelected);
      if(!producSitetSelected){
        throw 'El producto a editar no existe'
      }

      const response = await this.service.updateSinDto(producSitetSelected.idProduct.toString(),{idStatusType : statusTypeSelected._id});
      // console.log("response",response);
      if(!response){
        throw `Ocurrio un error al cambiar el estado ${body?.status} al producto `;
      }

      const productUpdated = await this.productSiteService.updateSinDto(id,{idStatusType : statusTypeSelected._id});
      // console.log("productUpdated",productUpdated);
      if(!productUpdated){
        throw `Ocurrio un error al cambiar el estado ${body?.status} al productoSite `;
      }
      return productUpdated;


    }catch(error){
      throw new InternalServerErrorException(error)
    }
  }
  
}
