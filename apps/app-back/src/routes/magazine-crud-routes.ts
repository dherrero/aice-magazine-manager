import { Router } from 'express';
import { authController, magazineCrudController } from '../controllers';

const magazineCrudRouter = Router();

magazineCrudRouter.get(
  '/',
  //authController.hasPermission('ADMIN'),
  magazineCrudController.getAll
);
magazineCrudRouter.get(
  '/:id',
  authController.hasPermission('ADMIN'),
  magazineCrudController.getById
);
magazineCrudRouter.post(
  '/',
  authController.hasPermission('ADMIN'),
  magazineCrudController.post
);
magazineCrudRouter.put(
  '/:id',
  authController.hasPermission('ADMIN'),
  magazineCrudController.put
);
magazineCrudRouter.delete(
  '/:id',
  authController.hasPermission('ADMIN'),
  magazineCrudController.delete
);

export default magazineCrudRouter;
