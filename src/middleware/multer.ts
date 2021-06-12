import {ExpressRequestHandler, HttpErrors, toInterceptor} from '@loopback/rest';
import multer, {StorageEngine} from 'multer';
import path from 'path';
import {v4 as uuidv4} from 'uuid';

//Multer storage
const storage: StorageEngine = multer.diskStorage({
  destination: path.resolve(__dirname, '../../files'),
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

//Multer images middleware
const multerMiddlewareImages: ExpressRequestHandler = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|svg/;
    const mimetype = filetypes.test(file.mimetype);

    const extname = filetypes.test(path.extname(file.originalname));

    if (mimetype && extname) {
      return cb(null, true);
    }
    console.log('hubo un error');
    cb(
      new HttpErrors.BadRequest(
        'El archivo debe ser una imagen valida (.jpg , .png, .gif, .svg)',
      ),
    );
  },
}).single('image_file');

//Multer documents middleware
const multerMiddlewareDocuments: ExpressRequestHandler = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;

    const mimetype = filetypes.test(file.mimetype);

    const extname = filetypes.test(path.extname(file.originalname));

    if (mimetype && extname) {
      return cb(null, true);
    }
    console.log('hubo un error');
    cb(
      new HttpErrors.BadRequest(
        'El archivo debe ser un documento valido (.pdf)',
      ),
    );
  },
}).single('document_file');

const imagesInterceptor = toInterceptor(multerMiddlewareImages);
const documentsInterceptor = toInterceptor(multerMiddlewareDocuments);

export {imagesInterceptor, documentsInterceptor};
