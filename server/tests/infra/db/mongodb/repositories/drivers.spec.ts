import { MongoHelper } from "@/infra/db/mongodb/helpers";
import { DriversMongoDbRepository } from "@/infra/db/mongodb/repositories";
import { driversPayload, seedDrivers } from "@/utils";

const makeSut = () => new DriversMongoDbRepository();

describe("DriversMongoDbRepository", () => {
  beforeAll(async () => {
    await seedDrivers();
  })

  afterAll(async () => {
    const collection = await MongoHelper.getCollection('drivers');
    await collection.deleteMany({});
  })

  it("Should return drivers on success", async () => {
    const sut = makeSut();

    const drivers = await sut.handle();

    expect(drivers).toBeTruthy();
  })

  it("Should return the correct drivers", async () => {
    const sut = makeSut();

    const drivers = await sut.handle()

    expect(drivers.length).toBe(3);
    expect(drivers[0]).toEqual(driversPayload[0]);
    expect(drivers[1]).toEqual(driversPayload[1]);
    expect(drivers[2]).toEqual(driversPayload[2]);
  })
});
