import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    mongo: {
      username: process.env.MONGO_INITDB_ROOT_USERNAME,
      password: process.env.MONGO_INITDB_ROOT_PASSWORD,
      dbname: process.env.MONGO_DB,
      port: parseInt(process.env.MONGO_PORT),
      host: process.env.MONGO_HOST,
      connection: process.env.MONGO_CONNECTION,
    },
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'sa-east-1',
      bucketName: process.env.AWS_BUCKET_NAME,
    },
  };
});
