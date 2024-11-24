import { Collection, MongoClient } from "mongodb";

const MONGO_URI = "mongodb://127.0.0.1:27017/transports-db";

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect(): Promise<void> {
    this.client = await MongoClient.connect(MONGO_URI)
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  async getCollection(name: string): Promise<Collection> {
    if (this.client === null) {
      await this.connect();
    }
    return this.client.db().collection(name);
  }
}
