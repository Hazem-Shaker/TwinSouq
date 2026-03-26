import mongoose from "mongoose";

export interface ICategoryAdminResponse {
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  parent: mongoose.Types.ObjectId | null;
  image: {
    url: string;
  };
}
