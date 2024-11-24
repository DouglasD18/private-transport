import { DriversRepository } from "@/data/protocols";
import { Driver } from "@/domain/models";
import { MongoHelper } from "../helpers";

export class DriversMongoDbRepository implements DriversRepository {
  async handle(): Promise<Driver[]> {
    return (await MongoHelper.getCollection("drivers")).find({}).toArray() as unknown as Driver[];
  }
  
}
