import {inject, intercept} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  post,
  Request,
  response,
  ResponseObject,
  RestBindings,
} from '@loopback/rest';
import {createReadStream} from 'fs';
import {unlink} from 'fs-extra';
import {sendgridConfig} from '../config/config.index';
import {documentsInterceptor, imagesInterceptor} from '../middleware/multer';
import {ImageRepository} from '../repositories';
import {uploadFile} from '../services/aws_s3';
import {passportInterceptor, passportInterceptor2} from '../services/passport';
import {sendMail} from '../services/sendgrid';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(
    @repository(ImageRepository) private imageRepository: ImageRepository,
    @inject(RestBindings.Http.REQUEST) private request: Request,
  ) {}

  // Map to `GET /ping`
  @get('/ping')
  @intercept(passportInterceptor)
  @response(200, PING_RESPONSE)
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers

    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @get('/pong')
  @intercept(passportInterceptor2)
  @response(200, PING_RESPONSE)
  pong(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.request.headers),
    };
  }

  @post('/mail')
  async mail(): Promise<object> {
    console.log('-----------Request:', this.request.body);
    await sendMail.send({
      to: <string>this.request.body.email,
      from: sendgridConfig.email,
      subject: 'Tu usuario Inmobi ha sido creado',
      text: 'Tu Usuario Inmobi ha sido creado',
      html: `
      <div
      style="
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 25px;
      "
    >
      <div
        style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          width: max-content;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          border: 2px solid #b00020;
          border-radius: 16px;
        "
      >
        <img
          src="../assets/icons/inmobi-logo-red.svg"
          alt=""
          style="height: 40px"
        />
        <h1 style="color: #000; text-align: center; font-size: 32px">
          Tu usuario Inmobi ha sido creado
        </h1>

        <div
          style="
            width: max-content;
            padding: 4px 16px;
            background-color: #cfcfcf;
            border-radius: 8px;
          "
        >
          <h2 style="font-size: 28px">Datos del usuario</h2>

          <p style="font-size: 18px"><strong>Nombre:</strong> User Name</p>
          <p style="font-size: 18px">
            <strong>Usuario:</strong> ${this.req.body.email}
          </p>
          <p style="font-size: 18px"><strong> Password: </strong> FDDSg42sdf</p>
        </div>
      </div>
    </div>
      `,
    });

    return {
      send: true,
    };
  }

  @post('/image-upload')
  @intercept(imagesInterceptor)
  @response(200, {
    content: 'application/json',
  })
  async imagesUpload() {
    const file = this.req.file;

    return {
      file,
    };
  }

  @post('/document-upload')
  @intercept(documentsInterceptor)
  async documentsUpload() {
    const {
      file,
      body: {title},
    } = this.req;

    const fileStream = createReadStream(file.path);
    const uploadPath = 'documents/' + file.filename;

    const file_url = await uploadFile(fileStream, uploadPath);

    const saved_file = await this.imageRepository.create({
      title,
      url: <string>file_url,
      public_id: uploadPath,
      filename: file.filename,
      originalName: file.originalname,
    });

    await unlink(file.path);

    return saved_file;
  }
}

//Cloudinary upload
// const uploadedImage = await cloudinary.v2.uploader.upload(file.path, {
//   public_id: `lb4Folder/${path.basename(
//     file.path,
//     path.extname(file.path),
//   )}`,
// });
