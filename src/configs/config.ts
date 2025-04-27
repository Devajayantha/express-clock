import PrismaConfig from './PrismaConfig';

const prismaConfig = new PrismaConfig();

export const config = {
  prisma: prismaConfig,
}