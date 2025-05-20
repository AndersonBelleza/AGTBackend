import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { now, Types } from "mongoose";
import { generarID } from "src/utilities";
import { OrderDetail, OrderDetailSchema } from "./orderDetail.schema";

@Schema({
  timestamps: true
})

export class Order{
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

  @Prop({required: false, trim: true, type:String, ref: 'DocumentSerie'})
  idDocumentSerie?: Types.ObjectId;

  @Prop({required: true, trim: true, type:String})
  serie?: string;

  @Prop({required: true, trim: true, type:Number})
  correlative?: number;

  @Prop({default: [], type:[OrderDetailSchema]})
  detail: OrderDetail[];

  @Prop({required: false, trim: true, type:Types.ObjectId, ref: 'CodePromotional'})
  idCodePromotional: Types.ObjectId;

  @Prop({default: 0, required: false, trim: true, type:Number})
  discount?: number;

  @Prop({default: 0,required: true, trim: true, type:Number})
  commission?: number; //pasarela

  @Prop({default: 0,required: true, trim: true, type:Number})
  charge?: number; //delibery

  @Prop({default: 0,required: true, trim: true, type:Number})
  tax?: number; //impueso (igv)

  @Prop({default: 0,required: true, trim: true, type:Number})
  subTotal?: number;

  @Prop({default: 0,required: true, trim: true, type:Number})
  total?: number;

  @Prop({required: true, trim: true, type:Types.ObjectId, ref: 'CurrencyType'})
  idCurrencyType: Types.ObjectId;

  @Prop({required: false, type: Date, default: now})
  issueDate?: Date

  @Prop({required: false, type: Date, default: now})
  expirationDate?: Date

  @Prop({required: true, trim: true, type:Types.ObjectId, ref: 'DeliveryMethod'})
  idDeliveryMethod: Types.ObjectId;

  @Prop({required: true, trim: true, type:Types.ObjectId, ref: 'PaymentMethod'})
  idPaymentMethod: Types.ObjectId;

  @Prop({required: true, trim: true, type:Types.ObjectId, ref: 'StatusType'})
  idStatusType: Types.ObjectId;

  @Prop({required: true, trim: true, type:Types.ObjectId, ref: 'StatusType'})
  idStatusPay: Types.ObjectId;

  @Prop({required: false, trim: true, type:Types.ObjectId, ref: 'Site'})
  idSite?: Types.ObjectId;

  @Prop({required: true, trim: true, type:Types.ObjectId, ref: 'User'})
  idUser: Types.ObjectId;

  @Prop({required: false, trim: true, type:Types.ObjectId, ref: 'User'})
  idClientUser: Types.ObjectId;

  @Prop({required: false, trim: true, type:Types.ObjectId, ref: 'Site'})
  idClientSite?: Types.ObjectId;

  @Prop({required: false, trim: true, type:Types.ObjectId, ref: 'Company'})
  idClientCompany: Types.ObjectId;

  @Prop({required: false, trim: true, type:Types.ObjectId, ref: 'User'}) //no siempre existira solo en pocos casos especificos
  idSupplierUser: Types.ObjectId;

  @Prop({required: false, trim: true, type:Types.ObjectId, ref: 'Site'})
  idSupplierSite?: Types.ObjectId;

  @Prop({required: false, trim: true, type:Types.ObjectId, ref: 'Company'})
  idSupplierCompany: Types.ObjectId;

  //es la copia de los datos e usuario, pero aveces se modificar solo para esta tabla

  @Prop({required: false, trim: true, type:String})
  telephone: string;

  @Prop({required: false, trim: true, type:String})
  email: string;

  @Prop({required: false, trim: true})
  address: string;

  @Prop({required: false, trim: true, type:Types.ObjectId, ref: 'District'})
  idDistrict: Types.ObjectId;



  @Prop({required: false, trim: true, type:Types.ObjectId, ref: 'Company'})
  idCompanyFacturation: Types.ObjectId;

  @Prop({required: false, trim: true, type:String, ref: 'DocumentSerie'})
  idDocumentSerieFacturation: Types.ObjectId;

  @Prop({required: false, trim: true})
  serieFacturation: string;

  @Prop({required: false, trim: true, type:Number})
  correlativeFacturation?: number;

  // @Prop({required: false, trim: true})
  // serieFacturationDelibery: string;

  // @Prop({required: false, trim: true, type:Number})
  // correlativeFacturationDelibery?: number;

}

export const OrderSchema = SchemaFactory.createForClass(Order);