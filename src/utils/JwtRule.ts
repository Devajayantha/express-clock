import jwt from 'jsonwebtoken';

class JwtRule {
  static generateToken(userId: number): string {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET as string , { expiresIn: '1h' });
  }
}

export default JwtRule;