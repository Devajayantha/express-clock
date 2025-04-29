import PrismaConfig from './PrismaConfig';
import RedisConfig from './RedisConfig';

const prismaConfig = new PrismaConfig();
const redisConfig = new RedisConfig();

export const config = {
  prisma: prismaConfig,
  redis: redisConfig
}