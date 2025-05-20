import { Controller, Get, Post, Body, Param, Delete, HttpCode, NotFoundException, Req, Put, InternalServerErrorException } from '@nestjs/common';
import { ProductSiteService } from './productSite.service';
import { StatusTypeService } from 'src/statusType/statusType.service';
import { CreateProductSiteDto } from './dto/createProductSite.dto';
import { UpdateProductSiteDto } from './dto/updateProductSite.dto';
import { ProductCategoryService } from 'src/productCategory/productCategory.service';
import mongoose from 'mongoose';
import { deletePath } from 'src/utilities/awsMulter';

@Controller('productSite')
export class ProductoSiteController {
  constructor(
    private service: ProductSiteService,
    private statusTypeService: StatusTypeService,
    private productCategoryService: ProductCategoryService,
  ){}

  @Get()
  async list(){
    try {
      return await this.service.list();
    } catch (error) {
      throw error;
    }
  }

  @Get('getProductDefault/') // APK
  async getProductDefault() {
    const response = await this.service.listWithParams({ name: 'reloj' });
    if (!response) throw new NotFoundException('Elemento no encontrado..!');
    return response;
  }

  
  @Get('getProductsApk/') // APK
  async getProductsApk(){
    try {
      return await this.service.listWithParamsPopulate({});
    } catch (error) {
      throw error;
    }
  }

  @Get('searchProductDelibery/')
  async searchProductDelibery(){
    try {
      const response =  await this.service.findOneWithParams({"name" : "Delibery"});
      if(!response) throw new NotFoundException('Elemento no encontrado..!');
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('searchProductExiste')
  async searchProductExiste(@Body() body: any, @Req() req: Request) {
    try {
      const { name, idBrand, idProductCategory, idProductSubCategory, idProductSite} = body;
      var query: any = {};
      let filterAnd: any = [];

      //esto no va, era un testeo, no eliminar, sirve de ejemplo
      // if(idProductSite){
      //   const response =  await this.service.findIdPopulate(idProductSite);
      //   if(!response) throw new NotFoundException('Producto no encontrado..!');
      //   if(response?.name != name){
      //     if (name) {
      //       query['name'] = name;
      //     }
      //   }
      // }else{
      // }
      
      if (name) {
        query['name'] = name;
      }

      if (idBrand) {
        filterAnd.push({
          $or: [
            { idBrand : idBrand },
            { idBrand : new mongoose.Types.ObjectId(idBrand) },
          ]
        });
      }
      if (idProductCategory) {
        filterAnd.push({
          $or: [
            { idProductCategory : idProductCategory },
            { idProductCategory : new mongoose.Types.ObjectId(idProductCategory) },
          ]
        });
      }
      if (idProductSubCategory) {
        filterAnd.push({
          $or: [
            { idProductSubCategory : idProductSubCategory },
            { idProductSubCategory : new mongoose.Types.ObjectId(idProductSubCategory) },
          ]
        });
      }

      console.log("filterAnd",filterAnd);
      if (filterAnd.length > 0) {
        query.$and = filterAnd;
      }

      const response = await this.service.listWithParams(query);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('findIdPopulate/:id')
  async findIdPopulate(@Param('id') id:string){
    try {
      const response =  await this.service.findIdPopulate(id);
      if(!response) throw new NotFoundException('Elemento no encontrado..!');
      return response;
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

  @Post('productByCategory')
  async productByCategory(@Body() body: any, @Req() req: Request) {
    try {
      let limitCategory = 6;

      
      let categorys = [];
      let categorysReturn = [];
      const statusType = await this.statusTypeService.findOneWithParams({name:"Activo", proccess: "ProductCategory"});
      if(!statusType) throw ("El estado Activo del proccess ProductCategory no existe")
      for (let i = 1; i<limitCategory; i++) {
        let categorySelected = await this.productCategoryService.findOneWithParams({order : i.toString(),idStatusType : statusType._id});
        if(categorySelected){
          categorys.push({
            idCategory : categorySelected._id,
            name : categorySelected.name,
            icon : categorySelected.icon,
            products : []
          });
        }
      }
 
      // console.log("categorysArr",categorys);
 
      if(categorys.length <= 0){
        throw 'No hay productos con categorias Activo con ProductCategory'
      }


      const statusTypepRODUCT1 = await this.statusTypeService.findOneWithParams({name:"Publicado", proccess: "Product"});
      if(!statusTypepRODUCT1) throw ("El estado Publicado del proccess Product no existe")
      const statusTypepRODUCT2 = await this.statusTypeService.findOneWithParams({name:"Agotado", proccess: "Product"});
      if(!statusTypepRODUCT2) throw ("El estado Agotado del proccess Product no existe")

      // console.log("statusTypepRODUCT1",statusTypepRODUCT1);
      // console.log("statusTypepRODUCT2",statusTypepRODUCT2);

      // console.log("cat ",categorys);
      for (const cat of categorys) {
        // console.log("cat ",cat);
        
        const products = await this.service.listWithParamsAsyncPopulate(0, 15, 
          {
            idProductCategory : cat.idCategory, 
            "$or" : [
              { idStatusType: statusTypepRODUCT1?._id },
              { idStatusType: statusTypepRODUCT1?._id.toString()},
              { idStatusType: statusTypepRODUCT2?._id },
              { idStatusType: statusTypepRODUCT2?._id.toString()},
            ]
          }
        ); //esto hace que filtre, stock mayor a 0 , stock : {$gt : 0}
        // console.log(`products ${cat.name}`,products);
        if(products && products.results.length > 0){
          const productsCats = products.results;
          cat.products = productsCats;
          categorysReturn.push(cat);
        }
      }


      return categorysReturn;

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('filterStore')
  async filterStore(@Body() body : any, @Req() req: Request){
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
  

  @Post('listWithParamsAsyncPopulateOnlyActive')
  async listWithParamsAsyncPopulateOnlyActive(@Body() body : any, @Req() req: Request){
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

      const statusType = await this.statusTypeService.findOneWithParams({name:"Publicado", proccess: "Product"});
      if(statusType){
        body.idStatusType = statusType._id;
        body.stock = {$gt : 0};
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
      // console.log("bodyRecommend",body);
      
      const response = await this.service.listWithParamsAsyncPopulate(skip, limit, body, order);
      if(!response) throw ('Elemento no encontrado..!');
      return response;

    }catch(err){
      console.log("err",err);
      throw new InternalServerErrorException(err);
    }
  }
  
  @Post()
  async create(@Body() body: CreateProductSiteDto, @Req() req: Request){
    try {
      if(!body.idStatusType){
        // Cambiar proccess si es necesario, por ahora lo dejo con Default
        const statusType = await this.statusTypeService.findOneWithParams({name:"Publicado", proccess: "Product"});
        if(!statusType) throw 'Tipo de Estado Activo no encontrado..!';
        body.idStatusType = statusType?._id;
      }else{
        body.idStatusType = new mongoose.Types.ObjectId(body?.idStatusType);
      }
      
      const response = await this.service.create(body);
      return response
    } catch (error) {
      throw error
    }
  }

  @Put(':id')
  async update(@Param('id')  id : string, @Body() body: UpdateProductSiteDto, @Req() req: Request){
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

  @Post('findWithParamsPopulate')
  // @UseGuards(AuthGuard)
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

      const response = await this.service.listWithParamsAsyncPopulateAsync(skip, limit, body);
      if(!response) throw ('Elemento no encontrado..!');
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
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


  // ESTE ENDPOINT SE USA DESDE EL MODULO DE PRODUCTO ADMINISTRADOR
  @Post('deleteImgServer')
  async deleteImgServer(@Body() body : any, @Req() req: Request){
    try{
      let producSitetSelected = await this.service.findId(body?.id);
      if(!producSitetSelected){
        throw 'El productoSite a editar no existe'
      }

      if(producSitetSelected?.images?.length > 0){
        var images = producSitetSelected?.images;
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

        let producSite = await this.service.updateSinDto(body?.id,{images : images});
        return producSite;

      }else{
        throw 'El producto no tiene imagenes'
      }
    }catch(error){
      // console.log("error",error);
      throw new InternalServerErrorException(error);
    }
  }

  // Buscar del navbar de la tienda
  @Post('searchProductNavbar')
  async searchProductNavbar(@Body() body: any, @Req() req: Request) {
    try {
      const statusTypepRODUCT = await this.statusTypeService.findOneWithParams({name:"Publicado", proccess: "Product"});
      if(!statusTypepRODUCT) throw ("El estado Publicado del proccess Product no existe")
      const statusTypepRODUCT2 = await this.statusTypeService.findOneWithParams({name:"Agotado", proccess: "Product"});
      if(!statusTypepRODUCT2) throw ("El estado Agotado del proccess Product no existe")

  

      const products = await this.service.listWithParamsAsync2(0, 15, 
        {
          name : {$regex: new RegExp(body.name, 'i')}, 
          "$or" : [
            { idStatusType: statusTypepRODUCT?._id },
            { idStatusType: statusTypepRODUCT?._id.toString()},
            { idStatusType: statusTypepRODUCT2?._id },
            { idStatusType: statusTypepRODUCT2?._id.toString()},
          ]
        });
      return products;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
