import { PrismaClient, Prisma } from "@prisma/client";

class PrismaConfig {
  private static _instance: PrismaConfig;

  private client: PrismaClient;

  private static _debug: boolean = process.env.DEBUG === 'true';

  constructor() {
    this.client = new PrismaClient({
      log: PrismaConfig._debug
        ? [
          {
            emit: 'event',
            level: 'query',
          },
        ]
        : [],
    });
  }

  public static getInstance(): PrismaConfig {
    if (!PrismaConfig._instance) {
      console.log('Creating PrismaConfig instance');
      PrismaConfig._instance = new PrismaConfig

      PrismaConfig.logging();
    }

    return PrismaConfig._instance;
  }

  public getClient(): PrismaClient {
    return this.client;
  }

  private static logging(): void {
    if (PrismaConfig._debug) {
      (PrismaConfig._instance.client as any).$on('query', (e: any) => {
        console.log(`[Prisma Query] ${e.query} -- Params: ${e.params}`);
      });
    }
  }
}

export default PrismaConfig;