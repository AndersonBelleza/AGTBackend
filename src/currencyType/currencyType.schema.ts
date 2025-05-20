import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { generarID } from "src/utilities";

@Schema({
  timestamps: true
})

export class CurrencyType{
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
  proccess: string;

  @Prop({required: false, trim: true, type:String})
  description?: string;

  @Prop({required: false, trim: true, type:String})
  symbol: string;

  @Prop({required: true, trim: true, type:String, ref: 'StatusType'})
  idStatusType: Types.ObjectId;
}

export const CurrencyTypeSchema = SchemaFactory.createForClass(CurrencyType);