import { Router } from 'express';
import { authController } from '../controllers';

const authRouter = Router();

authRouter.post('/login', authController.login);

export default authRouter;
