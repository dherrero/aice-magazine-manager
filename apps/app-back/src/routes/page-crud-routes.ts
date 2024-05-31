import { Router } from 'express';
import { authController, pageCrudController } from '../controllers';

const pageCrudRouter = Router();

pageCrudRouter.get(
  '/',
  authController.hasPermission('ADMIN'),
  pageCrudController.getAll
);
pageCrudRouter.get(
  '/:id',
  authController.hasPermission('ADMIN'),
  pageCrudController.getById
);
pageCrudRouter.post(
  '/',
  authController.hasPermission('ADMIN'),
  pageCrudController.post
);
pageCrudRouter.put(
  '/:id',
  authController.hasPermission('ADMIN'),
  pageCrudController.put
);
pageCrudRouter.delete(
  '/:id',
  authController.hasPermission('ADMIN'),
  pageCrudController.delete
);

export default pageCrudRouter;
