import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { generarID } from "src/utilities";

@Schema({
  timestamps: true
})

export class DocumentSerie{
  @Prop({default: '0', type: String})
  bool?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  code?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  internalCode?: string;

  @Prop({default: "#ffffff"})
  color?: string;

  @Prop({required: true, trim: true, type:String})
  serie: string;

  @Prop({required: true, trim: true, type:Number})
  correlative: Number;

  @Prop({required: false, trim: true, type:String})
  description?: string;

  @Prop({required: true, trim: true, type:String, ref: 'StatusType'})
  idStatusType: Types.ObjectId;

  @Prop({required: false, trim: true, type:String, ref: 'DocumentType'})
  idDocumentType: Types.ObjectId;

  @Prop({required: false, trim: true, type:String, ref: 'Enterprise'})
  idCompany: Types.ObjectId;

  @Prop({required: false, trim: true, type:String, ref: 'Site'})
  idSite: Types.ObjectId;
}

export const DocumentSerieSchema = SchemaFactory.createForClass(DocumentSerie);