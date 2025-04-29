import Redis, { Redis as RedisClient } from 'ioredis';

class RedisConfig {
  private static _instance: RedisConfig;

  private client: RedisClient;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      db: Number(process.env.REDIS_DB) || 0,
    });
  }

  public static getInstance(): RedisConfig {
    if (!RedisConfig._instance) {
      RedisConfig._instance = new RedisConfig();
    }
    return RedisConfig._instance;
  }

  public async set(key: string, value: any, expireSeconds?: number): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    
    if (expireSeconds) {
      await this.client.set(key, stringValue, 'EX', expireSeconds);
    } else {
      await this.client.set(key, stringValue);
    }
  }

  public async get<T = any>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    }
    return null;
  }

  public async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  public getClient(): RedisClient {
    return this.client;
  }
}

export default RedisConfig;