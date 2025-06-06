import ElasticSearchConfig from './ElasticSearchConfig';
import PrismaConfig from './PrismaConfig';
import RedisConfig from './RedisConfig';

const prismaConfig = PrismaConfig.getInstance();
const redisConfig = new RedisConfig();
const elasticConfig = ElasticSearchConfig.getInstance();

export const config = {
  prisma: prismaConfig,
  redis: redisConfig,
  elastic: elasticConfig,
}