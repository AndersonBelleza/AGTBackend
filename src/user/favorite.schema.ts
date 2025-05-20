import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { generarID } from "src/utilities";
import { Types } from "mongoose";

@Schema({
  timestamps: true
})

export class FavoriteProduct{
  @Prop({default: '0', type: String})
  bool?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  code?: string;

  @Prop({default: () => generarID(), trim: true, type:String})
  internalCode?: string;

  @Prop({default: "#ffffff"})
  color?: string;

  @Prop({required: false, trim: true, type:Types.ObjectId, ref: 'ProductSite'})
  idProductSite: Types.ObjectId;
 
}

export const FavoriteProductSchema = SchemaFactory.createForClass(FavoriteProduct);