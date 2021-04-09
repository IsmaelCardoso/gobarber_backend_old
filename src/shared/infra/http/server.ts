import 'reflect-metadata';

import express, { Request, Response, NextFunction, response } from 'express';
import "express-async-errors";

import routes from './routes'; //verificar caso tenha algum erro
import uploadConfig from '../../../config/upload';
import AppError from '../../errors/AppError';

import '@shared/infra/typeorm';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory))
app.use(routes);

app.use((err: Error, req: Request, resp: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return resp.status(err.statusCode).json({
      status: "error",
      message: err.message,
    })
  }

  console.error(err);

  return resp.status(500).json({
    status: 'error',
    message: "Internal server error",
  })

});

app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
