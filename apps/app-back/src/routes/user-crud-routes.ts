import { Router } from 'express';
import { authController, userCrudController } from '../controllers';

const userCrudRouter = Router();

userCrudRouter.get(
  '/',
  authController.hasPermission('ADMIN'),
  userCrudController.getAll
);
userCrudRouter.get(
  '/:id',
  authController.hasPermission('ADMIN'),
  userCrudController.getById
);
userCrudRouter.post(
  '/',
  authController.hasPermission('ADMIN'),
  userCrudController.post
);
userCrudRouter.put(
  '/:id',
  authController.hasPermission('ADMIN'),
  userCrudController.put
);
userCrudRouter.delete(
  '/:id',
  authController.hasPermission('ADMIN'),
  userCrudController.delete
);

export default userCrudRouter;
