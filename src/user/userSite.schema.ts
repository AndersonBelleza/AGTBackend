import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { generarID } from "src/utilities";
import { Types } from "mongoose";

@Schema({
  timestamps: true
})

export class UserSite{
  @Prop({default: '0', type: String})
  bool?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  code?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  internalCode?: string;

  @Prop({default: "#ffffff"})
  color?: string;

  @Prop({required: true, trim: true, type:String, unique : true})
  webAccess: string;

  @Prop({required: true, trim: true, type:Types.ObjectId, ref: 'Enterprise'})
  idCompany: Types.ObjectId;

  @Prop({required: true, trim: true, type:Types.ObjectId, ref: 'Site'})
  idSite: Types.ObjectId;
 
}

export const UserSiteSchema = SchemaFactory.createForClass(UserSite);