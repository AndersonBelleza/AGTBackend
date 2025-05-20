import { SchemaFactory, Prop, Schema } from "@nestjs/mongoose";
import { generarID } from "src/utilities";
import { Types } from "mongoose";
import { UserSite, UserSiteSchema } from "./userSite.schema";
import { FavoriteProduct, FavoriteProductSchema } from "./favorite.schema";
import { UserAddresses, UserAddressesSchema } from "./userAddresses.schema";


@Schema({
  timestamps: true
})

export class User{
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
  telephone: string;

  @Prop({required: false, trim: true, type:String})
  email: string;

  @Prop({required: true, trim: true, type:Types.ObjectId, ref: 'Person'})
  idPerson: Types.ObjectId;

  @Prop({required: true, trim: true, type:String, unique : true})
  username: string;

  @Prop({required: true, trim: true, type:String, unique : false})
  password: string;

  @Prop({required: false, trim: true, type:[Object]})
  images: [Object];

  @Prop({required: false, trim: true, type:[FavoriteProductSchema]})
  favorites: [FavoriteProduct];

  @Prop({required: true, trim: true, type:Types.ObjectId, ref: 'StatusType'})
  idStatusType: Types.ObjectId;

  @Prop({required: false, trim: true, type:Types.ObjectId, ref: 'UserType'})
  idUserType: Types.ObjectId;

  @Prop({default: new Map<string, string>(), type: Map, of: String})
  specs: Map<string, string>;

  @Prop({required: true, trim: true, type:[UserSiteSchema]})
  userSite: [UserSite];

  @Prop({required: true, trim: true, type:[UserAddressesSchema]})
  addresses: [UserAddresses];

  @Prop({required: false, trim: true, type:String })
  role?: string;

}

export const UserSchema = SchemaFactory.createForClass(User);