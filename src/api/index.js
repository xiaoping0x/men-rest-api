import { Router } from 'express';
import user from './user';
import auth from './auth';
import task from './task/router';

const router = new Router();

router.route('/').get((req, res) => {
  res.json({ message: 'Welcome to ido API!' });
});

// access_token: master,admin,user
// ?q=xx&page=1&limit=10&sort=-a,+b&fields=a,b,c
router.use('/users', user);
router.use('/auth', auth);
router.use('/tasks', task);

export default router;
