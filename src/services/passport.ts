import {toInterceptor} from '@loopback/express';
import {HttpErrors} from '@loopback/rest';
import passport from 'passport';
import {ExtractJwt, Strategy, StrategyOptions} from 'passport-jwt';

const options: StrategyOptions = {
  //jwtFromRequest: ExtractJwt.fromHeader("custom_header_name"),
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //Header => Autorization : Bearer token
  secretOrKey: 'project_pp3_JWT_pass',
};

const JWTStrategy = new Strategy(options, async (payload, done) => {
  done(null, {
    algo: 'esot es algo',
  });
});

const passportInterceptor = toInterceptor(
  passport.authenticate('jwt', {session: false}),
  (req, res, next) => {
    next();
  },
);

const passportInterceptor2 = toInterceptor(
  passport.authenticate('jwt', {session: false}),
  (req, res, next) => {
    throw new HttpErrors[401]('segundo interceptor');
  },
);

export {JWTStrategy, passportInterceptor, passportInterceptor2};
