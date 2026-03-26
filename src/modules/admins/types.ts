import { Document } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IAdminResponseData = Omit<IAdmin, "password" | "__v"> &
  Partial<Pick<IAdmin, "password">> & { __v?: number };
