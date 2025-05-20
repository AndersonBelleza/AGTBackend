import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { generarID } from "src/utilities";

@Schema({
  timestamps: true
})

export class Banner{
  @Prop({default: '0', type: String})
  bool?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  code?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  internalCode?: string;

  @Prop({default: "#ffffff"})
  color?: string;

  @Prop({required: true, trim: true, type:String})
  type: string;

  @Prop({required: true, trim: true, type:String})
  name: string;

  @Prop({required: false, trim: true, type:String})
  description?: string;

  @Prop({required: false, trim: true, type:String})
  url?: string;

  @Prop({required: false, trim: true, type:String})
  order?: string;

  @Prop({required: false, trim: true, type:Object})
  image?: {};

  @Prop({required: true, trim: true, type:String, ref: 'StatusType'})
  idStatusType: Types.ObjectId;

  @Prop({required: false, trim: true, type:String, ref: 'Company'})
  idCompany: Types.ObjectId;

  @Prop({required: false, trim: true, type:String, ref: 'Site'})
  idSite: Types.ObjectId;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);