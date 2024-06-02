import { authController } from '@back/controllers';
import { Router } from 'express';

const healthRouter = Router();

healthRouter.get('', (_, res) => {
  res.status(200).json({ health: '👌' });
});

healthRouter.get('/secure', authController.hasPermission(), (_, res) => {
  res.status(200).json({ health: '👌', secure: '🔐' });
});

export default healthRouter;
