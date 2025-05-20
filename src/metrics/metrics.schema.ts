import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { generarID } from "src/utilities";
import { Types } from "mongoose";

@Schema({
  timestamps: true
})

export class Metrics{

  @Prop({required: true, trim: true, type:String})
  name: string;

  @Prop({required: false, trim: true, type:String})
  description?: string;

  @Prop({required: true, trim: true, type:String})
  type: string;

  @Prop({required: true, trim: true, type:Types.ObjectId, ref: 'StatusType'})
  idStatusType: Types.ObjectId;

  @Prop({required: false, trim: true, type:Types.ObjectId, ref: 'User'})
  idUser?: Types.ObjectId;

}

export const MetricsSchema = SchemaFactory.createForClass(Metrics);