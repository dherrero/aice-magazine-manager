import { Router } from 'express';
import { authController } from '../controllers';

const healthRouter = Router();

healthRouter.get('', (_, res) => {
  res.status(200).send('👌');
});

healthRouter.get('/secure', authController.hasPermission(), (_, res) => {
  res.status(200).send('🔐');
});

export default healthRouter;
