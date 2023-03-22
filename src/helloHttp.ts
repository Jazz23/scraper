import { HttpFunction } from '@google-cloud/functions-framework'
import { Request, Response}  from '@google-cloud/functions-framework'

export const helloHttp: HttpFunction = (req: Request, res: Response) => {
  res.send('Hello World');
};
