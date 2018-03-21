import { Router } from 'express';
import { login, logout } from './controller';
import { password, token, facebook, github, google } from '../../services/passport';

const router = new Router();

router.post(
  '/',
  password(),
  login,
);

router.post(
  '/logout',
  token(),
  logout,
);

router.post(
  '/facebook',
  facebook(),
  login,
);

router.post(
  '/github',
  github(),
  login,
);

router.post(
  '/google',
  google(),
  login,
);

export default router;
