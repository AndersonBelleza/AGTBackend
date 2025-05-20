import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { generarID } from "src/utilities";

@Schema({
  timestamps: true
})

export class CodePromotional{
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

  @Prop({required: true, trim: true, type:String, ref: 'StatusType'})
  idStatusType: Types.ObjectId;

  @Prop({required: false, trim: true, type:Date})
  expirationDate: Date;

  @Prop({required: false, trim: true, type:Date})
  startDate: Date;

  @Prop({default : 'Discount',required: false, trim: true, type:String})
  type: Date;

  @Prop({required: false, trim: true, type:Number})
  limit: number;

  @Prop({required: false, trim: true, type:Number})
  correlative: number;

  @Prop({default : '0', required: false, type:String})
  typeDiscount: String;

  @Prop({required: false, trim: true, type:Number})
  value: number;

  @Prop({required: false, trim: true, type:String, ref: 'Company'})
  idCompany: Types.ObjectId;

  @Prop({required: false, trim: true, type:String, ref: 'Site'})
  idSite: Types.ObjectId;
}

export const CodePromotionalSchema = SchemaFactory.createForClass(CodePromotional);