import redis from "../configs/redis.config";

export async function save(type:string, userId: number, data: Object) {
  await redis.hset(`${type}:${userId}`, data);
  await redis.sadd(type, userId);
};

export async function getDetail(type:string, userId: number) {
  const user = await redis.hgetall(`${type}:${userId}`);
  return Object.keys(user).length ? user : null; 
}