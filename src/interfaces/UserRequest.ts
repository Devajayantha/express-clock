import { Request } from 'express';

export default interface UserRequest extends Request {
  id: number;
  name: string;
  email: string;
}
