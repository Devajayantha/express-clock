import { ApiResponse, Client as ElasticClient } from "@elastic/elasticsearch";

class ElasticSearchConfig {
  private static _instance: ElasticSearchConfig;

  private client: ElasticClient;

  constructor() {
    this.client = new ElasticClient({
      node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200",
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME || "elastic",
        password: process.env.ELASTICSEARCH_PASSWORD || "password",
      }
    });
  }

  public static getInstance(): ElasticSearchConfig {
    if (!ElasticSearchConfig._instance) {
      ElasticSearchConfig._instance = new ElasticSearchConfig();
    }
    return ElasticSearchConfig._instance;
  }

  public async addRecord(index: string, body: any, id?: string): Promise<ApiResponse> {
    const params: any = { index, body };
    if (id) {
      params.id = id;
    }

    const response = await this.client.index(params);
    await this.client.indices.refresh({ index });
    return response;
  }

  public async updateRecord(index: string, id: string, updatedFields: any): Promise<ApiResponse> {
    const response = await this.client.update({
      index,
      id,
      body: { doc: updatedFields },
    });
    await this.client.indices.refresh({ index });

    return response;
  }

  public async deleteRecord(index: string, id: string): Promise<ApiResponse> {
    const response = await this.client.delete({
      index,
      id,
    });
    await this.client.indices.refresh({ index });

    return response;
  }

  public async search(index: string, query: any): Promise<ApiResponse> {
    const response = await this.client.search({
      index,
      body: query,
    });

    return response;
  }

  public getClient(): ElasticClient {
    return this.client;
  }
}


export default ElasticSearchConfig;