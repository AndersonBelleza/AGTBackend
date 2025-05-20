import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, InternalServerErrorException, UseInterceptors, UploadedFiles, UseGuards } from '@nestjs/common';
import { ProductPresentationService } from './productPresentation.service';
import { StatusTypeService } from 'src/statusType/statusType.service';
import { UpdateProductSubCategoryDto } from 'src/productSubCategory/dto/updateProductSubCategory.dto';
import { CreateProductPresentationDto } from './dto/createProductPresentation.dto';
import { UpdateProductPresentationDto } from './dto/updateProductPresentation.dto';
import { CurrencyTypeService } from 'src/currencyType/currencyType.service';
import { ProductTypeService } from 'src/productType/productType.service';
import { ProductCategoryService } from 'src/productCategory/productCategory.service';
import { ProductSubCategoryService } from 'src/productSubCategory/productSubCategory.service';
import { BrandService } from 'src/brand/brand.service';
import mongoose, { mongo } from 'mongoose';
import { memoryStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CompanyService } from 'src/company/company.service';
import { createFolder, deletePath, uploadFileS3Many, verifyFolder } from 'src/utilities/awsMulter';
import { SiteService } from 'src/site/site.service';
import { ProductSiteService } from 'src/productSite/productSite.service';
import { randomUUID } from 'crypto';
import { generarCodigo } from 'src/utilities';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProductService } from 'src/product/product.service';
import { DocumentSerieService } from 'src/documentSeries/documentSerie.service';

@Controller('productPresentation')
export class ProductPresentationController {
  constructor(
    private service: ProductPresentationService,
    private statusTypeService: StatusTypeService,
    private currencyTypeService: CurrencyTypeService,
    private productTypeService: ProductTypeService,
    private productCategoryService: ProductCategoryService,
    private productSubCategoryService: ProductSubCategoryService,
    private brandService: BrandService,
    private companyService : CompanyService,
    private siteService : SiteService,
    private productSiteService : ProductSiteService,
    private productService : ProductService,
    private documentSerieService: DocumentSerieService
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
      if(!response) throw 'Elemento no encontrado..!';
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  

  @Get('findIdPresentation/:id')
  async findIdPresentation(@Param('id') id:string){
    try {
      const response =  await this.service.findIdPopulate(id);
      if(!response) throw 'Elemento no encontrado..!';
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('findIdSubPresentation/:id')
  async findIdSubPresentation(@Param('id') id:string){
    try {
      const response =  await this.service.findOneWithParamsPopulate({'subPresentation._id': new mongoose.Types.ObjectId(id)});
      
      if(!response) throw 'subPresentación no encontrado..!';
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('findIdSubPresentationExact/:id')
  async findIdSubPresentationExact(@Param('id') id:string){
    try {
      const response:any =  await this.service.findOneWithParamsPopulate({'subPresentation._id': new mongoose.Types.ObjectId(id)});
      if(!response) throw 'subPresentación no encontrado..!';
      const response2 = response?.subPresentation?.find((obj)=>obj?._id == id);

      return response2;
    } catch (error) {
      throw new InternalServerErrorException(error);
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

  @Post('findWithParams')
  async findWithParams(@Body() body : any, @Req() req: Request){
    try {

      if(body.idProductoSite){
        body.idProductoSite = new mongoose.Types.ObjectId(body.idProductoSite);
      }

      if(body.idStatusType){
        body.idStatusType = new mongoose.Types.ObjectId(body.idStatusType);
      }
      if(body.idProductSite){
        body.idProductSite = new mongoose.Types.ObjectId(body.idProductSite);
      }

      const response = await this.service.listWithParams(body);
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

      if(body.idProduct){

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

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: memoryStorage(), // Almacenar el archivo en memoria para manejarlo manualmente
  }))
  async create(@Body() body: any, @Req() req: Request, @UploadedFiles() files: Express.Multer.File[],){
    try {
      let filesRegister:any = [];
      let cod = "";
      let productSiteSelected = await this.productSiteService.findId(body.idProductSite);
      if(!productSiteSelected){
        throw "No existe este producto";
      }
      let productSelected = await this.productService.findId(productSiteSelected.idProduct.toString());
      if(!productSelected){
        throw "No existe este producto";
      }
      let siteSelected = await this.siteService.findId(productSiteSelected.idSite.toString());
      if(!siteSelected){
        throw "No existe esta sede";
      }
      
      if(!body.idStatusType){
        const statusType = await this.statusTypeService.findOneWithParams({name:"Publicado", proccess: "Product"});
        if(!statusType) throw 'Tipo de Estado Publicado no encontrado..!';
        body.idStatusType = statusType?._id;
      }else{
        body.idStatusType = new mongoose.Types.ObjectId(body?.idStatusType);
      }

 
      if(productSiteSelected.sku){
        cod = productSiteSelected.sku
      }else{
      // if(!productSelected.idProductCategory || !productSelected.idProductSubCategory){
      //   const productCategory = await this.productCategoryService.findOneWithParams({name:"Default"});
      //   if(!productCategory) throw 'Categoria de Producto Default no encontrado..!';      
      //   body.idProductCategory = productCategory?._id;
      //   const productSubCategory = await this.productSubCategoryService.findOneWithParams({name:"Default", idProductCategory: productCategory?._id});
      //   if(!productSubCategory) throw 'SubCategoria de Producto Default no encontrado..!';
      //   body.idProductSubCategory = productSubCategory?._id;
      //   cod += `${productCategory.name[0]}${productSubCategory.name[0]}${productSubCategory.name[1] || "N"}`.toLocaleUpperCase();
      // }else{
      //   let categorySelected = await this.productCategoryService.findId(productSelected.idProductCategory.toString());
      //   let subCategorySelected = await this.productSubCategoryService.findId(productSelected.idProductSubCategory.toString());
      //   cod += `${categorySelected.name[0]}${subCategorySelected.name[0]}${subCategorySelected.name[1] || "N"}`.toLocaleUpperCase();
      // }
      }

      if(body.idProductSite){
        body.idProductSite = new mongoose.Types.ObjectId(body?.idProductSite);
      }
      

      if(!body.stock){
        body.stock = 0;
      }

      if(body.spec){
        body.specs = JSON.parse(body.spec);
      }
      if(body.policies){
        body.warrantyPolicy = JSON.parse(body.policies);
      }

      let correlative = await this.service.listWithParams({idProductSite : productSiteSelected._id});
      if(correlative && correlative.length > 0){
        cod += (correlative.length+1).toString();
        body.sku = cod;
      }else{
        cod += "1";
        body.sku = cod;

      }
      // if(body.idDocumentSerie){
      //   let documentSerieSelected = await this.documentSerieService.findId(body.idDocumentSerie);
      //   if(!documentSerieSelected){
      //     throw 'Error al obtener el correlativo';
      //   }
      //   cod += `${documentSerieSelected.correlative.toString().padStart(4,'0')}`
      //   body.sku = cod;
      //   body.correlative = documentSerieSelected.correlative;
      // }

      if(files.length > 0){
        let conpany = await this.companyService.findId(siteSelected.idCompany.toString());
        let folderBase = conpany.businessName;
        const verify = await verifyFolder(folderBase);
        if (verify.exists == false) {
          const folder = await createFolder(folderBase);
          if (!folder.success) {
            return folder.message;
          }
        }
        let folder2 = `${folderBase}/PRODUCTOPRESENTATION`;
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
          filesRegister = await Promise.all(promiseResult);
          body.images = filesRegister;
        }
      }
 
      const response = await this.service.create(body); 
      // if(response){
      //   let responseDC = await this.documentSerieService.update(body.idDocumentSerie,{correlative : (parseInt(body.correlative || 0) + 1)});
      //   if(responseDC && responseDC._id){
      //     body.correlative = responseDC.correlative;
      //   }
      // }
      return response;
    } catch (error) {
      console.log("errorProductrPresnetation",error);
      throw new InternalServerErrorException(error)
    }
  }

  @Put(':id')
  async update(@Param('id')  id : string, @Body() body: UpdateProductPresentationDto, @Req() req: Request){
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

  @Post('productByCategory')
  async productByCategory(@Body() body: any, @Req() req: Request) {
    try {
      console.log("click"); 
      let limitCategory = 5;

      let categorys = [];
      for (let i = 0; i<limitCategory; i++) {
        let categorySelected = await this.productCategoryService.findOneWithParams({order : i.toString()});
        if(categorySelected){
          categorys.push({
            idCategory : categorySelected._id,
            name : categorySelected.name,
            icon : categorySelected.icon,
            products : []
          });
        }
      }
 
      if(categorys.length <= 0){
        throw 'No hay categorias con order'
      }

      for (const cat of categorys) {
        const products = await this.service.listWithParamsAsyncPopulate(null, 15, {idProductCategory : cat.idCategory});
        if(products && products.results.length > 0){
          cat.products = products.results;
        }
      }


      return categorys;

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Put('productUpdate/:id')
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: memoryStorage(), // Almacenar el archivo en memoria para manejarlo manualmente
  }))
  async updateV2(@Body() body: any, @Param('id') id : string,@Req() req: Request, @UploadedFiles() files: Express.Multer.File[],){
    try {
      let filesRegister:any = [];
      let cod = "";

      let productPresentationSelected = await this.service.findId(id);
      if(!productPresentationSelected){
        throw 'El producto a editar no existe'
      }
      let productSiteSelected = await this.productSiteService.findId(productPresentationSelected.idProductSite.toString());
      if(!productSiteSelected){
        throw 'El producto  site a editar no existe'
      }
      let siteSelected = await this.siteService.findId(productSiteSelected.idSite.toString());
      if(!siteSelected){
        throw 'El Site a editar no existe'
      }
      let companySelected = await this.companyService.findId(productSiteSelected.idCompany.toString());
      if(!companySelected){
        throw 'El Site a editar no existe'
      }

      if(!body.stock || body.stock == 0){
          delete body.stock;
      }
      if(body.stockMin|| body.stockMin == 0){
          delete body.stockMin;
      }

      if(body.spec){
        body.specs = JSON.parse(body.spec);
      }

      if(body.policies){
        body.warrantyPolicy = JSON.parse(body.policies);
      }


      if(files.length > 0){
        let conpany = await this.companyService.findId(companySelected._id.toString());
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

          filesRegister = await Promise.all(promiseResult);
          body.images = productPresentationSelected.images.concat(filesRegister);
        }
      }
      console.log("bodyPresena"),body;
      const response = await this.service.update(id,body);
      console.log("responseProductSite",response);
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

  @Put('changeStatusSubPresentation/:id/:index')
  async changeStatusSubPresentation(@Body() body: any, @Param('id') id : string , @Param('index') index : string ,@Req() req: Request){
    try{
      let status = "";
      let subPresentation = [];
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

      let presentationSelected = await this.service.findId(id);
      if(!presentationSelected){
        throw 'Error al obteenr el registro';
      }

      if(!presentationSelected.subPresentation){
        throw 'No hay datos para actualizar';
      }

      subPresentation = presentationSelected.subPresentation;

      const subPresentationSelected:any = subPresentation[index];
      if(!subPresentationSelected){
        throw 'No hay datos para actualizar';
      }

      subPresentation[index].idStatusType = statusTypeSelected._id;
      console.log("subPResentaion",subPresentation);
      let productUpdated = await this.service.updateSinDto(id,{subPresentation : subPresentation});
      return productUpdated;

    }catch(error){
      console.log("error",error);
      throw error
    }
  }

  @Put('addSubPresentaion/:id')
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: memoryStorage(), // Almacenar el archivo en memoria para manejarlo manualmente
  }))
  async addSubPresentaion(@Body() body: any, @Param('id') id : string ,@Req() req: Request,@UploadedFiles() files: Express.Multer.File[],){
    try{
      console.log("body",body);
      let subPresentation:any = [];
      let cod = "";
      let presntationSelected = await this.service.findId(id);
      if(!presntationSelected){throw 'Presentacion no encontrado'}

      if(!body.idStatusType){
        const statusType = await this.statusTypeService.findOneWithParams({name:"Publicado", proccess: "Product"});
        if(!statusType) throw 'Tipo de Estado Publicado no encontrado..!';
        body.idStatusType = statusType?._id;
      }else{
        body.idStatusType = new mongoose.Types.ObjectId(body?.idStatusType);
      }

        if(body.nameSubPresentation){
          body.name = body.nameSubPresentation;
        }
        if(body.typeDiscountSubPresentation){
          body.typeDiscount = body.typeDiscountSubPresentation;
        }
        if(body.SubPresentationDiscount){
          body.discount = body.SubPresentationDiscount;
        }
        if(body.SubPresentationStock){
          body.stock = body.SubPresentationStock;
        }
        if(body.StockMaxUserPre){
          body.StockMaxUser = body.StockMaxUserPre;
        }
        if(body.SubPresentationStockMin){
          body.stockMin = body.SubPresentationStockMin;
        }
        if(body.descriptionSubPresentation){
          body.description = body.descriptionSubPresentation;
        }
        if(body.unitValueSubPresentation){
          body.unitValue = body.unitValueSubPresentation;
          body.unitPrice = body.unitValueSubPresentation;
        }


      // if(body.idDocumentSerie){
      //   let documentSerieSelected = await this.documentSerieService.findId(body.idDocumentSerie);
      //   if(!documentSerieSelected){
      //     throw 'Error al obtener el correlativo';
      //   }
      //   cod += `${documentSerieSelected.correlative.toString().padStart(4,'0')}`
      //   body.sku = cod;
      //   body.correlative = documentSerieSelected.correlative;
      // }
      if(presntationSelected.subPresentation){
        subPresentation = presntationSelected.subPresentation;
      }
      if(presntationSelected.sku){
        cod = presntationSelected.sku;
      } 

      if(subPresentation && subPresentation.length > 0){
        cod += (subPresentation.length+1).toString();
        body.sku = cod;

      }else{
        cod += "1";
        body.sku = cod;

      }

      

      if(files.length > 0){
        let conpany = await this.companyService.findId(body.idCompany);
        if(!conpany){throw 'Error al obtener datos de la empresa'}
        let folderBase = conpany.businessName;
        const verify = await verifyFolder(folderBase);
        if (verify.exists == false) {
          const folder = await createFolder(folderBase);
          if (!folder.success) {
            return folder.message;
          }
        }
        let folder2 = `${folderBase}/PRODUCTOSUBPRESENTATION`;
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
          let filesRegister = await Promise.all(promiseResult);
          body.images = filesRegister;
        }
      }
      
      subPresentation.push(body);
      console.log("sub",subPresentation);
      let presentationUpdated = await this.service.updateSinDto(id,{subPresentation : subPresentation});
      console.log("presentationUpdated",presentationUpdated);
      if(presentationUpdated){
        let responseDC = await this.documentSerieService.update(body.idDocumentSerie,{correlative : (parseInt(body.correlative || 0) + 1)});
        if(responseDC && responseDC._id){
          body.correlative = responseDC.correlative;
        }
        
      }
      return presentationUpdated;

    }catch(error){
      console.log("error",error);
      throw error
    }
  }

  @Put('updateSubPresentaion/:idS')
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: memoryStorage(), // Almacenar el archivo en memoria para manejarlo manualmente
  }))
  async updateSubPresentaion(@Body() body: any, @Param('idS') idS : string ,@Req() req: Request,@UploadedFiles() files: Express.Multer.File[],){
    try{
      console.log("body",body);
      console.log("idS ,", idS);
      
      const presntationSelected:any =  await this.service.findOneWithParams({'subPresentation._id': new mongoose.Types.ObjectId(idS)});
      if(!presntationSelected) throw 'subPresentación no encontrado..!';

      const indexSelected = presntationSelected?.subPresentation?.findIndex((obj)=>obj?._id == idS);
      const productSubPresentationSelected = presntationSelected?.subPresentation?.find((obj)=>obj?._id == idS);
      // console.log("indexSelected",indexSelected);
      // console.log("productSubPresentationSelected",productSubPresentationSelected);

      // return "a"
      const subPresentations = presntationSelected.subPresentation  || [];

      let subPresentationSelected = (presntationSelected.subPresentation || [])[indexSelected]
      if(!subPresentationSelected){
        throw 'No existe el registro'
      }

      if(body.nameSubPresentation){
        subPresentationSelected.name = body.nameSubPresentation;
      }
      if(body.typeDiscountSubPresentation){
        subPresentationSelected.typeDiscount = body.typeDiscountSubPresentation;
      }
      if(body.SubPresentationDiscount){
        subPresentationSelected.discount = body.SubPresentationDiscount;
      }
      if(body.SubPresentationStock){
        subPresentationSelected.stock = body.SubPresentationStock;
      }
      if(body.SubPresentationStockMin){
        subPresentationSelected.stockMin = body.SubPresentationStockMin;
      }
      if(body.StockMaxUserPre){
        subPresentationSelected.StockMaxUser = body.StockMaxUserPre;
      }
      if(body.descriptionSubPresentation){
        subPresentationSelected.description = body.descriptionSubPresentation;
      }
      if(body.unitValueSubPresentation){
        subPresentationSelected.unitValue = body.unitValueSubPresentation;
        subPresentationSelected.unitPrice = body.unitValueSubPresentation;
      }
      
      subPresentationSelected.color = body.color;

      if(files.length > 0){
        let conpany = await this.companyService.findId(body.idCompany);
        if(!conpany){throw 'Error al obtener datos de la empresa'}
        let folderBase = conpany.businessName;
        const verify = await verifyFolder(folderBase);
        if (verify.exists == false) {
          const folder = await createFolder(folderBase);
          if (!folder.success) {
            return folder.message;
          }
        }
        let folder2 = `${folderBase}/PRODUCTOSUBPRESENTATION`;
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
          let filesRegister:any = await Promise.all(promiseResult);
          let imgs = subPresentationSelected.images.concat(filesRegister);
          subPresentationSelected.images= imgs;
        }
      }
      // console.log("body",body);
      console.log("subPresentationSelected ",subPresentationSelected);
      
      subPresentations[indexSelected] = subPresentationSelected; 
      console.log("subPresentations ",subPresentations);

      let presentationUpdated = await this.service.updateSinDto(presntationSelected?._id.toString(),{subPresentation : subPresentations});
      // console.log("presentationUpdated",presentationUpdated);
      return presentationUpdated;

    }catch(error){
      console.log("error",error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get('getSubPresentationIndex/:id/:index')
  async getSubPresentationIndex(@Param('id') id:string,@Param('index') index:string){
    try {
      // console.log("index",index);
      // console.log("id",id);
      const indexSelected = parseInt(index||"0");
      const presentationSelected = await this.service.findId(id);
      const subPresentation = presentationSelected.subPresentation;
      if(!subPresentation[indexSelected]){
        throw "No existe este registro"
      }      
      return subPresentation[indexSelected];
    } catch (error) {
      console.log("errorGetSubPresentation",error   );
      throw new InternalServerErrorException(error);
    }
  }

  @Put('deleteImg/:id/:index')
  async deleteImg(@Body() body: any, @Param('id') id : string ,@Param('index') index : string ,@Req() req: Request){
    try{
      let images:any = [];
      let indexSelected = parseInt(index || "0");
      let userSelected = await this.service.findId(id);
      if(!userSelected){throw 'Usuario no encontrado'}
 
      if(userSelected.images){
        images = userSelected.images;
      }
      if(body.index){
        indexSelected = parseFloat(body.index);
      }

      if(!images[indexSelected] && !images[indexSelected].key){
        throw 'Imagen no encontrada';
      }


      const res:any = await deletePath(images[indexSelected].key);
      console.log("resEli",res);
      if(!res.deleted){
          return res
      }


      images.splice(indexSelected,1);


      let productPresentation = await this.service.update(id,{images : images});
      if(!productPresentation){
        throw "Error al eliminar img";
      }
      console.log("productPresentation",userSelected);
      return productPresentation;

    }catch(error){
      console.log("error",error);
      throw new InternalServerErrorException(error);
    }
  }
  @Put('deleteImgSubPresentation/:id/:index/:indexImg')
  async deleteImgSubPresentation(@Body() body: any, @Param('id') id : string ,@Param('index') index : string ,@Param('indexImg') indexImg : string ,@Req() req: Request){
    try{
      let subPresentations:any = [];
      let images:any = [];
      let indexSelected = parseInt(index || "0");
      let indexImgSelected = parseInt(indexImg || "0");
      let product = await this.service.findId(id);
      if(!product){throw 'Producto no encontrado'}
 
      if(product.subPresentation){
        subPresentations = product.subPresentation;
      }

      if(!subPresentations[indexSelected] && !subPresentations[indexSelected].key){
        throw 'Producto no encontrada 1';
      }

      images = subPresentations[indexSelected].images;
      if(!images[indexImgSelected]){
        throw 'Producto no encontrada 2';

      }

      const res:any = await deletePath(images[indexImgSelected].key);
      console.log("resEli",res);
      if(!res.deleted){
          return res
      }



      images.splice(indexImgSelected,1);

      subPresentations[indexSelected].images = images;

      let productPresentation = await this.service.updateSinDto(id,{subPresentation : subPresentations});
      if(!productPresentation){
        throw "Error al eliminar img";
      }
      console.log("productPresentation",productPresentation);
      return productPresentation.subPresentation[indexSelected];

    }catch(error){
      console.log("error",error);
      throw new InternalServerErrorException(error);
    }
  }

  // ESTE ENDPOINT SE USA DESDE EL MODULO DE PRODUCTO PRESENTACION ADMINISTRADOR
  @Post('deleteImgServer')
  async deleteImgServer(@Body() body : any, @Req() req: Request){
    try{
      let productPresentationSelected = await this.service.findId(body?.id);
      if(!productPresentationSelected){
        throw 'El productoSite a editar no existe'
      }

      if(productPresentationSelected?.images?.length > 0){
        var images = productPresentationSelected?.images;
        // console.log("images ",images);
        
        // Encontrar el índice del objeto con el key especificado
        const indice = images.findIndex((img:any) => img.key == body?.path);
        const img:any = images.find((img:any) => img.key == body?.path);
    
        if (img?.key) {
          // Eliminar el objeto del array

          const res:any = await deletePath(img?.key);
          // console.log("resEli",res);
          if(!res.deleted){
            return res
          }

          images.splice(indice, 1);
          // console.log(`Se eliminó el objeto con key '${body?.path}' del array.`);
        } else {
          throw `No se encontró ningún objeto con key '${body?.path}'.`;
        }
        // console.log("images ",images);

        let productPresentation = await this.service.updateSinDto(body?.id,{images : images});
        return productPresentation;

      }else{
        throw 'El producto no tiene imagenes'
      }
    }catch(error){
      // console.log("error",error);
      throw new InternalServerErrorException(error);
    }
  }


  // ESTE ENDPOINT SE USA DESDE EL MODULO DE PRODUCTO PRESENTACION ADMINISTRADOR
  @Post('deleteImgSubPresentationServer')
  async deleteImgSubPresentationServer(@Body() body : any, @Req() req: Request){
    try {

      const response:any =  await this.service.findOneWithParamsPopulate({'subPresentation._id': new mongoose.Types.ObjectId(body?.id)});
      if(!response) throw 'subPresentación no encontrado..!';

      var subPresentations = response?.subPresentation;
  
      const indexSelected = response?.subPresentation?.findIndex((obj)=>obj?._id);
      const productSubPresentationSelected = response?.subPresentation?.find((obj)=>obj?._id);
      if(!productSubPresentationSelected) throw 'subPresentación no encontrado..!';
      console.log("encontrada ",productSubPresentationSelected);
      
      if(productSubPresentationSelected?.images?.length > 0){
        var images = productSubPresentationSelected?.images;
        // console.log("images ",images);
        
        // Encontrar el índice del objeto con el key especificado
        const indice = images.findIndex((img:any) => img.key == body?.path);
        const img:any = images.find((img:any) => img.key == body?.path);
    
        if (img?.key) {
          // Eliminar el objeto del array

          const res:any = await deletePath(img?.key);
          // console.log("resEli",res);
          if(!res.deleted){
            return res
          }

          images.splice(indice, 1);
          // console.log(`Se eliminó el objeto con key '${body?.path}' del array.`);
        } else {
          throw `No se encontró ningún objeto con key '${body?.path}'.`;
        }
        // console.log("images ",images);

        subPresentations[indexSelected].images = images;

        let productPresentation = await this.service.updateSinDto(response?._id.toString(),{subPresentation : subPresentations});
        return productPresentation.subPresentation[indexSelected];

      }else{
        throw 'La subPresentacion no tiene imagenes'
      }
      
    } catch (error) {
      throw new InternalServerErrorException(error);
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

      const response = await this.service.updateSinDto(id,{idStatusType : statusTypeSelected._id});
      // console.log("response",response);
      if(!response){
        throw `Ocurrio un error al cambiar el estado ${body?.status} al producto `;
      }
      return response;


    }catch(error){
      throw new InternalServerErrorException(error)
    }
  }

  //NO TOCAR ESTO, SE USA EN LA TIENDA
  @Put('changeStatusSub2/:id')
  async changeStatusSub2(@Body() body: any, @Param('id') id : string ,@Req() req: Request){
    try{
      
      const presntationSelected:any =  await this.service.findOneWithParams({'subPresentation._id': new mongoose.Types.ObjectId(id)});
      if(!presntationSelected) throw 'subPresentación no encontrado..!';

      const indexSelected = presntationSelected?.subPresentation?.findIndex((obj)=>obj?._id == id);
      const productSubPresentationSelected = presntationSelected?.subPresentation?.find((obj)=>obj?._id == id);
      // console.log("indexSelected",indexSelected);
      // console.log("productSubPresentationSelected",productSubPresentationSelected);

      // return "a"
      const subPresentations = presntationSelected.subPresentation  || [];

      let subPresentationSelected = (presntationSelected.subPresentation || [])[indexSelected]
      if(!subPresentationSelected){
        throw 'No existe el registro'
      }



      const statusTypeSelected = await this.statusTypeService.findOneWithParams({name : body?.status, proccess : "Product"});
      // console.log("statusTypeSelected",statusTypeSelected);
      if(!statusTypeSelected){
        throw `No existe el estado ${body?.status}`
      }
      subPresentationSelected.idStatusType = statusTypeSelected._id;

      subPresentations[indexSelected] = subPresentationSelected;


      let presentationUpdated = await this.service.updateSinDto(presntationSelected?._id.toString(),{subPresentation : subPresentations});
      console.log("presentationUpdated",presentationUpdated);
      if(!presentationUpdated){
        throw `Ocurrio un error al cambiar el estado ${body?.status} al producto `;
      }
      return presentationUpdated;


    }catch(error){
      throw new InternalServerErrorException(error)
    }
  }
  
}