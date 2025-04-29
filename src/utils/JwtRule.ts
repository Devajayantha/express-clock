import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

class JwtRule {
  static generateToken(user: User): string {
    return jwt.sign({id: user.id, name: user.name, email: user.email}, process.env.JWT_SECRET as string , { expiresIn: '1h' });
  }
}

export default JwtRule;