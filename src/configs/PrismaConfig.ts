import { PrismaClient } from "@prisma/client";

class PrismaConfig  {
  private static _instance: PrismaClient;

  constructor() {
    if (!PrismaConfig._instance) {
      PrismaConfig._instance = new PrismaClient();
    }
  }

  public getClient(): PrismaClient {
    return PrismaConfig._instance;
  }

}

export default PrismaConfig;