import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { generarID } from "src/utilities";

@Schema({
  timestamps: true
})

export class ProductSubPresentation{
  @Prop({default: '0', type: String})
  bool?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  code?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  internalCode?: string;

  @Prop({default: ""})
  color?: string;

  @Prop({required: true, trim: true, type:String})
  name: string;

  @Prop({required: false, trim: true, type:String})
  description?: string;

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

  @Prop({type: Number, default: 0})
  discount: number;





  @Prop({required: false, trim: true, type:String})
  sku?: string;

  @Prop({required: true, trim: true, type:String, ref: 'StatusType'})
  idStatusType: Types.ObjectId;

}

export const ProductSubPresentationSchema = SchemaFactory.createForClass(ProductSubPresentation);