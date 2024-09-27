import { config } from 'dotenv';
config();

export default {
  port: process.env.PORT || 3002,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATA_BASE_URL: process.env.DATA_BASE_URL || '',
  DATA_BASE_TOKEN: process.env.DATA_BASE_URL || '',
};
