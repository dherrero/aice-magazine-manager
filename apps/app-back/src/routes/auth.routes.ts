import { authController } from '@back/controllers';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/login', authController.login);

export default authRouter;
