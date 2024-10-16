import { authController } from '@back/controllers';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/login-credential', authController.loginCredentials);

authRouter.get(
  '/challenge-credential',
  authController.hasPermission(),
  authController.createChallenge
);
authRouter.post(
  '/register-credential',
  authController.hasPermission(),
  authController.registerCredentials
);

export default authRouter;
