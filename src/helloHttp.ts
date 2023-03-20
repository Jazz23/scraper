import { HttpFunction } from '@google-cloud/functions-framework'
import { Request, Response}  from 'express'

export const helloHttp: HttpFunction = (req: Request, res: Response) => {
  res.send('Hello World');
};
