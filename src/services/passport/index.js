import passport from 'passport';
import { Schema } from 'bodymen';
import { BasicStrategy } from 'passport-http';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { jwtSecret, masterKey } from '../../config';
import * as facebookService from '../facebook';
import * as githubService from '../github';
import * as googleService from '../google';
import User, { schema } from '../../api/user/model';

const debug = require('debug')('ido:passport');

export const password = () => (req, res, next) =>
  passport.authenticate('password', { session: false }, (err, user, info) => {
    debug('passport auth');

    if (err && err.param) {
      debug('auth error %O', err);

      return res.status(400).json(err);
    } else if (err || !user) {
      debug('auth user is null, error: %O', err);

      return res.status(401).end();
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) {
        debug('logIn error %O', err);
        return res.status(401).end();
      }

      next();
    });
  })(req, res, next);

export const facebook = () =>
  passport.authenticate('facebook', { session: false });

export const github = () =>
  passport.authenticate('github', { session: false });

export const google = () =>
  passport.authenticate('google', { session: false });

export const master = () =>
  passport.authenticate('master', { session: false });

export const token = ({ required, roles = User.roles } = {}) => (req, res, next) =>
  passport.authenticate('token', { session: false }, (err, user, info) => {
    if (err || (required && !user) || (required && !~roles.indexOf(user.role))) {
      debug('token auth error %O, required=%o, user: %O', err, required, user);

      return res.status(401).end();
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) {
        debug('token auth logIn error %O', err);
        return res.status(401).end();
      }

      next();
    });
  })(req, res, next);

passport.use('password', new BasicStrategy((email, password, done) => {
  const userSchema = new Schema({ email: schema.tree.email, password: schema.tree.password });

  userSchema.validate({ email, password }, (err) => {
    if (err) done(err);
  });

  User.findOne({ email }).then((user) => {
    if (!user) {
      done(true);
      return null;
    }
    return user.authenticate(password, user.password).then((user) => {
      done(null, user);
      return null;
    }).catch(done);
  });
}));

passport.use('facebook', new BearerStrategy((token, done) => {
  facebookService.getUser(token).then(user => User.createFromService(user)).then((user) => {
    done(null, user);
    return null;
  }).catch(done);
}));

passport.use('github', new BearerStrategy((token, done) => {
  githubService.getUser(token).then(user => User.createFromService(user)).then((user) => {
    done(null, user);
    return null;
  }).catch(done);
}));

passport.use('google', new BearerStrategy((token, done) => {
  googleService.getUser(token).then(user => User.createFromService(user)).then((user) => {
    done(null, user);
    return null;
  }).catch(done);
}));

passport.use('master', new BearerStrategy((token, done) => {
  if (token === masterKey) {
    done(null, {});
  } else {
    done(null, false);
  }
}));

passport.use('token', new JwtStrategy({
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromUrlQueryParameter('access_token'),
    ExtractJwt.fromBodyField('access_token'),
    ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  ]),
}, ({ id }, done) => {
  User.findById(id).then((user) => {
    done(null, user);
    return null;
  }).catch(done);
}));
