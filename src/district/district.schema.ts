import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { generarID } from "src/utilities";

@Schema({
  timestamps: true
})

export class District{
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

  @Prop({required: true, trim: true, type:String})
  ubigeo: string;

  @Prop({default: false , required: false, trim: true, type: Boolean})
  availabilityDelivery?: boolean;

  @Prop({required: true, trim: true, type:String, ref: 'Province'})
  idProvince: Types.ObjectId;
}

export const DistrictSchema = SchemaFactory.createForClass(District);