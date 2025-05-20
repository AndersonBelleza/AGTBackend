import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { generarID } from "src/utilities";

@Schema({
  timestamps: true
})

export class Product{
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

  @Prop({required: true, trim: true, type:String, ref: 'ProductCategory'})
  idProductCategory: Types.ObjectId;

  @Prop({required: true, trim: true, type:String, ref: 'ProductSubCategory'})
  idProductSubCategory: Types.ObjectId;

  @Prop({required: true, trim: true, type:String, ref: 'ProductType'})
  idProductType: Types.ObjectId;

  @Prop({required: true, type:Types.ObjectId, ref:'Brand'})
  idBrand: Types.ObjectId;

  @Prop({required: true, type:Types.ObjectId, ref:'Company'})
  idCompany: Types.ObjectId;

  @Prop({required: false, type:Types.ObjectId, ref:'UnitMeasure'})
  idUnitMeasure: Types.ObjectId;

  @Prop({required: true, trim: true, type:String, ref: 'StatusType'})
  idStatusType: Types.ObjectId;

}

export const ProductSchema = SchemaFactory.createForClass(Product);