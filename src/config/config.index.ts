import dotenv from 'dotenv';
//Interfaces
import {
  awsConfigInterface,
  cloudinaryConfigInterface,
  mongoConfigInterface,
  sendgridConfigInterface,
} from './config.interfaces';

//Dotenv initialization
dotenv.config();

const mongoConfig: mongoConfigInterface = {
  uri: <string>process.env.MONGO_URI,
  host: <string>process.env.MONGO_HOST,
  port: Number(process.env.MONGO_PORT) || 27017,
  user: <string>process.env.MONGO_USER,
  password: <string>process.env.MONGO_PASSWORD,
  db_name: <string>process.env.MONGO_DB_NAME,
};

const cloudinaryConfig: cloudinaryConfigInterface = {
  cloud_name: <string>process.env.CLOUDINARY_CLOUD_NAME,
  api_key: <string>process.env.CLOUDINARY_API_KEY,
  api_secret: <string>process.env.CLOUDINARY_API_SECRET,
};

const awsConfig: awsConfigInterface = {
  accessKeyId: <string>process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: <string>process.env.AWS_SECRET_ACCESS_KEY,
  region: <string>process.env.AWS_REGION,
  bucketName: <string>process.env.AWS_BUCKET_NAME,
};

const sendgridConfig: sendgridConfigInterface = {
  api_key: <string>process.env.SENDGRID_API_KEY,
  email: <string>process.env.SENDGRID_EMAIL,
};

export {mongoConfig, cloudinaryConfig, awsConfig, sendgridConfig};
