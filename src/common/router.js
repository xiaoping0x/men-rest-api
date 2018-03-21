import { Router } from 'express';
import { middleware as query } from 'querymen';
import { middleware as body } from 'bodymen';

// TODO(pj) master, admin, user
import { token } from '../services/passport';

export default function createRestRouter(controller) {
  const router = new Router();

  router
    .route('/')
    .get(token({ required: true }), query(), (...args) => controller.index(...args))
    .post(token({ required: true }),
      controller.beforeCreate ? (...args) => controller.beforeCreate(...args) : null,
      body(controller.getCreateFields()),
      (...args) => controller.create(...args));

  router
    .route('/:id')
    .get(token({ required: true }), (...args) => controller.show(...args))
    .put(token({ required: true }), body(controller.getUpdateFields()), (...args) => controller.update(...args))
    .delete(token({ required: true }), (...args) => controller.destroy(...args));

  return router;
}
