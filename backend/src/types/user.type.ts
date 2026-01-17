import { Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  locationId: any; // Schema.Types.ObjectId
  address: string;
  role: "user" | "admin";
  createdAt: Date;
}