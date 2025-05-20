import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { ObjectId, Types } from "mongoose";
import { generarID } from "src/utilities";

@Schema({
  timestamps: true
})

export class ProductSubCategory{
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

  @Prop({default: "", required: false, trim: true, type:String})
  icon: string;

  @Prop({required: false, trim: true, type:String})
  description?: string;

  @Prop({required: true, type:Types.ObjectId, ref: 'ProductCategory'})
  idProductCategory: ObjectId;

  @Prop({required: true, type:Types.ObjectId, ref: 'StatusType'})
  idStatusType: ObjectId;
}

export const ProductSubCategorySchema = SchemaFactory.createForClass(ProductSubCategory);