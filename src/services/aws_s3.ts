import {HttpErrors} from '@loopback/rest';
import aws from 'aws-sdk';
import {PutObjectRequest} from 'aws-sdk/clients/s3';
import {ReadStream} from 'fs';
import {awsConfig} from '../config/config.index';

aws.config.update({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.region,
});

const S3 = new aws.S3();

const uploadFile = async (file: ReadStream, path: string) => {
  const upload_params: PutObjectRequest = {
    Bucket: awsConfig.bucketName,
    Body: file,
    Key: path,
    ACL: 'public-read',
  };

  const uploaded_file = await S3.upload(upload_params)
    .promise()
    .then(data => data.Location)
    .catch(err => new HttpErrors.InternalServerError(err.message));

  return uploaded_file;
};

export {uploadFile};
