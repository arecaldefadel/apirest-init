import { config } from "dotenv";
config();

export default {
  port: process.env.PORT || 3002,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATA_BASE_URL: process.env.SUPABASE_URL || "",
  DATA_BASE_TOKEN: process.env.SUPABASE_KEY || "",
  API_KEY_CLOUDINARY: process.env.API_KEY_CLOUDINARY || "",
  API_SECRET_CLOUDINARY: process.env.API_SECRET_CLOUDINARY || "",
  CLOUD_NAME_CLOUDINARY: process.env.CLOUD_NAME_CLOUDINARY || "",
};
