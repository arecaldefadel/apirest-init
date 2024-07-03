import { config } from 'dotenv';
config();

export default {
  port: process.env.PORT || 3002,
  NODE_ENV: process.env.NODE_ENV || 'development',
};
