interface mongoConfigInterface {
  uri: string;
  host: string;
  port: number;
  user: string;
  password: string;
  db_name: string;
}

interface cloudinaryConfigInterface {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

interface awsConfigInterface {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
}

interface sendgridConfigInterface {
  api_key: string;
  email: string;
}

export {
  mongoConfigInterface,
  cloudinaryConfigInterface,
  awsConfigInterface,
  sendgridConfigInterface,
};
