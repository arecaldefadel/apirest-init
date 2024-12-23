import { createClient } from '@libsql/client';
import config from '../config.js';

const client = createClient({
  url: config.DATA_BASE_URL || '',
  authToken: config.DATA_BASE_TOKEN || '',
});

export default client;
