import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { generarID } from "src/utilities";

@Schema({
  timestamps: true
})

export class ProductSite{
  @Prop({default: '0', type: String})
  bool?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  code?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  internalCode?: string;

  @Prop({default: "#ffffff"})
  color?: string;

  @Prop({required: true, trim: true, type:String})
  name: string;

  @Prop({required: false, trim: true, type:String})
  description?: string;

  @Prop({required: true, type:Types.ObjectId, ref:'Brand'})
  idBrand: Types.ObjectId;

  @Prop({required: true, trim: true, type:String, ref: 'ProductCategory'})
  idProductCategory: Types.ObjectId;

  @Prop({required: true, trim: true, type:String, ref: 'ProductSubCategory'})
  idProductSubCategory: Types.ObjectId;

  @Prop({required: true, trim: true, type:String, ref: 'ProductType'})
  idProductType: Types.ObjectId;

  @Prop({required: false, type:Types.ObjectId, ref:'UnitMeasure'})
  idUnitMeasure: Types.ObjectId;

  @Prop({required: false, trim: true, type:String, ref: 'Product'})
  idProduct: Types.ObjectId;

  @Prop({required: true, type:Types.ObjectId, ref:'Company'})
  idCompany: Types.ObjectId;

  @Prop({required: false, trim: true, type:String, ref: 'Site'})
  idSite: Types.ObjectId;


  @Prop({required: false, trim: true, type:String, ref: 'CurrencyType'})
  idCurrencyType: Types.ObjectId;

  @Prop({required: false, trim: true, type:Number})
  unitValue: number;

  @Prop({required: false, trim: true, type:Number})
  unitPrice: number;

  @Prop({required: false, trim: true, type:[Object]})
  images: [];

  @Prop({required: false, trim: true, type:Number})
  stock: number;
  
  @Prop({default: 5, required: false, trim: true, type:Number})
  stockMin: number;

  @Prop({default: 10, required: false, trim: true, type:Number})
  StockMaxUser : number;

  @Prop({required: false, type:String})
  typeDiscount: String;

  @Prop({required: false, type:Boolean})
  new: boolean;

  @Prop({type: Number, default: 0})
  discount: number;

  @Prop({default: new Map<string, string>(), type: Map, of: String})
  specs: Map<string, string>;

  @Prop({required: false, trim: true, type:[Object]})
  warrantyPolicy: [];

  @Prop({required: false, trim: true, type:String})
  sku?: string;

  @Prop({required: true, trim: true, type:String, ref: 'StatusType'})
  idStatusType: Types.ObjectId;

  @Prop({required: false, trim: true, type:String})
  idExternal?: string;
}

export const ProductSiteSchema = SchemaFactory.createForClass(ProductSite);