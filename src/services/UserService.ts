import { Response } from "express";
import { config } from "../configs/config";
import { StatusCode } from "../enums/StatusCode";
import bcrypt from 'bcrypt';
import JwtRule from "../utils/JwtRule";
import { User } from "@prisma/client";

interface LoginInput {
  email: string;
  password: string;
}

class UserService {
  static async login({email, password}: LoginInput, res: Response): Promise<void> {
    const prisma = config.prisma.getClient();

    const user = await prisma.user.findFirst({
      where: { email: email }
    })

    if (!user) {
      res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: 'Invalid credentials',
        data: [],
        errors: { email: "Invalid credentials" }
      });

      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(StatusCode.BAD_REQUEST).json({
        success: false,
        message: 'Invalid credentials',
        data: [],
        errors: { password: "Invalid credentials" }
      });
    }

    const token = await this.tokenManipulate(user);

    res.status(StatusCode.OK).json({
      success: true,
      message: 'Login successful',
      data: { token: token, user: user },
      errors: {}
    });
  }

  protected static async tokenManipulate(user: User): Promise<string> {
    const prisma = config.prisma.getClient();
    const expiredAt = new Date();

    expiredAt.setHours(expiredAt.getHours() + 1);

    const token = await JwtRule.generateToken(user);
    
    const accessToken = await prisma.personalAccessToken.create({
      data: {
        name: 'Access Token',
        token: token,
        userId: user.id,
        expiredAt: expiredAt,
      }
    });

    return token;

  }

}

export default UserService;