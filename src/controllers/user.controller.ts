import { generateToken } from '../configs/jwt.config';
import { Request, Response } from 'express';
import { returnResponse } from '../utils/response.utils';
import { StatusCode } from '../enums/status-code.enum';
import prisma from '../configs/prisma.config';
import bcrypt from 'bcrypt';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: { email: email }
    })

    if (!user) {
      returnResponse(res, StatusCode.NOT_FOUND, false, [], "User not found", { email: "User not found" });
      return;
    }  

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      returnResponse(res, StatusCode.BAD_REQUEST, false, [], "Invalid credentials", { password: "Invalid credentials" });
      return;
    }

    const token = await tokenManipulate(user.id);

    console.log(token);

    returnResponse(res, StatusCode.OK, true, { 
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
     }, "User logged in successfully");

  } catch (error) {
    returnResponse(res, StatusCode.SERVER_ERROR, false, [], "Internal server error");
  }
}

async function tokenManipulate(userId:number): Promise<string> {
  const expiredAt = new Date();
  expiredAt.setHours(expiredAt.getHours() + 1);

  const token = await generateToken(userId);

  const accessToken = await prisma.personalAccessToken.create({
    data: {
      name: 'Access Token',
      token: token,
      userId: userId,
      expiredAt: expiredAt,
    }
  });

  return token;
}