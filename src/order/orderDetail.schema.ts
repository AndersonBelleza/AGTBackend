import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { TrustedAdvisor } from "aws-sdk";
import { Types } from "mongoose";
import { generarID } from "src/utilities";

@Schema({
  timestamps: true
})

export class OrderDetail{
  @Prop({default: '0', type: String})
  bool?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  code?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  internalCode?: string;

  @Prop({default: "#ffffff"})
  color?: string;

  @Prop({required: false, trim: true, type:Types.ObjectId, ref: 'ProductSite'})
  idProductSite: Types.ObjectId;

  @Prop({required: false, trim: true, type:Types.ObjectId, ref: 'ProductPresentation'})
  idProductPresentation: Types.ObjectId;

  @Prop({required: false, trim: true, type:String })
  idProductSubPresentation: string;

  @Prop({required: true, trim: true, type:String})
  name: string;

  @Prop({required: true, trim: true })
  typeDiscount?: number;

  @Prop({default: 0, required: true, trim: true, type:Number})
  unitValue: number;

  @Prop({default: 0, required: true, trim: true, type:Number})
  unitPrice: number;

  @Prop({default: 1, required: true, trim: true, type:Number})
  quantity: number;

  @Prop({default: 0,required: true, trim: true, type:Number})
  subTotal?: number;

  @Prop({default: 0,required: true, trim: true, type:Number})
  total?: number;
  
  @Prop({default: 0,required: true, trim: true, type:Number})
  discount?: number;
  
}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);