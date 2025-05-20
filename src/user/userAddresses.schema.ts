import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { generarID } from "src/utilities";
import { Types } from "mongoose";

@Schema({
  timestamps: true
})

export class UserAddresses{
  @Prop({default: '0', type: String})
  bool?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  code?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  internalCode?: string;

  @Prop({default: "#ffffff"})
  color?: string;


  @Prop({required: true, trim: true, type:Types.ObjectId, ref: 'Departament'})
  idDepartament	: Types.ObjectId;

  @Prop({required: true, trim: true, type:Types.ObjectId, ref: 'Province'})
  idProvince	: Types.ObjectId;

  @Prop({required: true, trim: true, type:Types.ObjectId, ref: 'District'})
  idDistrict	: Types.ObjectId;

  @Prop({required: false, trim: true, type:String})
  address	: string;

  @Prop({required: false, trim: true, type:String})
  reference	: string;

  @Prop({required: false, trim: true, type:String})
  telephoneA	: string;

  @Prop({required: false, trim: true, type:String})
  orden	: number;

  @Prop({required: false, trim: true, type:String})
  selected	: boolean;
 
}

export const UserAddressesSchema = SchemaFactory.createForClass(UserAddresses);