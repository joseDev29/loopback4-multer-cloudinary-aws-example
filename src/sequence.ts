import {
  DefaultSequence,
  ExpressRequestHandler,
  RequestContext,
} from '@loopback/rest';
import passport from 'passport';
//Express Middlewares
import {morganMiddleware} from './middleware/morgan';
import {JWTStrategy} from './services/passport';

const middlewareList: ExpressRequestHandler[] = [
  morganMiddleware,
  passport.initialize(), //multerMiddleware,
];

export class MySequence extends DefaultSequence {
  async handle(context: RequestContext) {
    try {
      const {request, response} = context;

      const finished = await this.invokeMiddleware(context, middlewareList);
      passport.use(JWTStrategy);

      if (finished) return;

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);

      // console.log('-------Finished: ', finished);
      // console.log('-------Route: ', route);
      // console.log('-------Args: ', args);
      // console.log('-------result: ', result);

      this.send(response, result);
    } catch (error) {
      this.reject(context, error);
    }
  }
}
