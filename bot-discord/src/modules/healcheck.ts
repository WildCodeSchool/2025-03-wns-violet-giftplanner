import { Request, Response } from 'express';
import client from '../bot';

const health = (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, botReady: client.isReady() });
};

export default { health };