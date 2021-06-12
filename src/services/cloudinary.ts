import cloudinary from 'cloudinary';
import {cloudinaryConfig} from '../config/config.index';

cloudinary.v2.config({
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key,
  api_secret: cloudinaryConfig.api_secret,
});

export {cloudinary};
