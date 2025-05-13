import { Request } from 'express';
import UserRequest from './UserRequest';

export default interface AuthRequest extends Request {
  user?: UserRequest;
}

