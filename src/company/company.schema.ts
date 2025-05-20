import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { generarID } from "src/utilities";

@Schema({
  timestamps: true
})
export class Company {
  @Prop({ default: '0', type: String })
  bool?: string;

  @Prop({ default: () => generarID(), trim: true, type: String })
  code?: string;

  @Prop({ default: "#ffffff" })
  color?: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Country' })
  countryId: Types.ObjectId;

  @Prop({ type: String, trim: true })
  ineiCode?: string;

  @Prop({ type: Types.ObjectId, ref: 'DocumentType' })
  documentTypeId?: Types.ObjectId;

  @Prop({ required: true, trim: true, type: String })
  documentNumber: string;

  @Prop({ required: true, trim: true, type: String })
  businessName: string;

  @Prop({ trim: true, type: String })
  commercialName?: string;

  @Prop({ type: Types.ObjectId, ref: 'StatusType' })
  statusTypeId?: Types.ObjectId;

  @Prop({ trim: true, type: String })
  address?: string;

  @Prop({ trim: true, type: String })
  phone?: string;

  @Prop({ trim: true, type: String })
  email?: string;

  @Prop({ required: true, trim: true, type: String })
  username: string;

  @Prop({ required: true, trim: true, type: String })
  password: string;

  @Prop({ type: Object })
  electronicBilling?: Object;

  @Prop({ type: [String], default: [] })
  accesses?: string[];

  @Prop({ trim: true, type: String })
  role?: string;

  @Prop({ type: Types.ObjectId, ref: 'Role' })
  roleId?: Types.ObjectId;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
