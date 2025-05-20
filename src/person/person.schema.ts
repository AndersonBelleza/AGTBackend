import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { generarID } from "src/utilities";

@Schema({
  timestamps: true
})

export class Person{
  @Prop({default: '0', type: String})
  bool?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  code?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  internalCode?: string;

  @Prop({default: "#ffffff"})
  color?: string;

  @Prop({required: true, trim: true, type:String})
  names: string;

  @Prop({required: false, trim: true, type:String})
  paternalSurname: string;

  @Prop({required: false, trim: true, type:String})
  maternalSurname: string;

  @Prop({required: false, trim: true, type:String, unique :true})
  document: string;

  @Prop({required: false, type:String})
  photoUrl: string;

  @Prop({required: false, trim: true, type:String})
  maritalStatus?: string;

  @Prop({required: false, trim: true, type:String})
  sex?: string;

  @Prop({required: false, trim: true, type:Date})
  birthdate?: Date;

  @Prop({required: true, trim: true, ref: 'StatusType'})
  idStatusType: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'DocumentType' })
  documentTypeId?: Types.ObjectId;
}

export const PersonSchema = SchemaFactory.createForClass(Person);