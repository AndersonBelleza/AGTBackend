import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { generarID } from "src/utilities";
import { Types } from "mongoose";

@Schema({
  timestamps: true
})

export class Site{
  @Prop({default: '0', type: String})
  bool: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  code?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  internalCode?: string;

  @Prop({default: "#ffffff"})
  color?: string;

  @Prop({required: true, trim: true, type:String})
  name: string;

  @Prop({required: true, trim: true, type:String})
  address: string;

  @Prop({required: false, trim: true, type:String})
  description?: string;

  @Prop({required: true, trim: true, type:Types.ObjectId, ref: 'Company'})
  idCompany: Types.ObjectId;
    
  @Prop({required: false, trim: true, type:[Object]})
  faq: [Object];

  @Prop({required: false, trim: true, type:[Object]})
  contacts: [Object];
  
  @Prop({required: false, trim: true, type:Object})
  logo?: [Object];

  @Prop({required: false, trim: true, type:Object})
  colors?: [Object];

  @Prop({ required: false, type: Types.ObjectId, ref: 'District' })
  idDistrict: Types.ObjectId;

  @Prop({required: true, trim: true, type:Types.ObjectId, ref: 'StatusType'})
  idStatusType: Types.ObjectId;

  @Prop({required: false, trim: true, type:String})
  idExternal?: string;
}

export const SiteSchema = SchemaFactory.createForClass(Site);