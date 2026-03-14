import { Request, Response } from 'express';

export const getHealthCheck = (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
};
