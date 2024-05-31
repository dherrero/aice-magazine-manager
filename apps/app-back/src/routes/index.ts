import { Router } from 'express';
import authRouter from './auth-routes';
import magazineCrudRouter from './magazine-crud-routes';
import pageCrudRouter from './page-crud-routes';
import pdfRouter from './pdf-routes';
import userCrudRouter from './user-crud-routes';

const api = Router();

/** public api */
api.use('/v1/auth', authRouter);

/** private api */
api.use('/v1/user', userCrudRouter);
api.use('/v1/magazine', magazineCrudRouter);
api.use('/v1/page', pageCrudRouter);
api.use('/v1/pdf', pdfRouter);

export default api;
