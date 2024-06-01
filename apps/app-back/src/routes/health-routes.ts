import { Router } from 'express';
import { authController } from '../controllers';

const healthRouter = Router();

healthRouter.get('', (_, res) => {
  res.status(200).json({ health: '👌' });
});

healthRouter.get('/secure', authController.hasPermission(), (_, res) => {
  res.status(200).json({ health: '👌', secure: '🔐' });
});

export default healthRouter;
