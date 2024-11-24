import { DriversRepository, GoogleApiRepository } from "@/data/protocols"
import { EstimateUseCaseAdapter } from "@/data/useCases"
import { Driver, GoogleApiResponse, Location, PostRequest, PostResponse } from "@/domain/models"

const DRIVER: Driver = {
  id: 88,
  name: "any_name",
  description: "any_description",
  vehicle: "any_vehicle",
  review: {
    rating: 27,
    comment: "any_comment"
  },
  value: 9,
  km: 17
}

const DRIVERS: Driver[] = [
  DRIVER
]

const ORIGIN: Location = {
  latitude: 5,
  longitude: 22
}

const DESTINATION: Location = {
  latitude: 18,
  longitude: 99
}

const API_RESPONSE: GoogleApiResponse = {
  origin: ORIGIN,
  destination: DESTINATION,
  distance: 33,
  duration: "2 horas"
}

const RESPONSE: PostResponse = {
  ...API_RESPONSE,
  options: [
    DRIVER
  ]
}

const PAYLOAD: PostRequest = {
  customerId: "any_id",
  origin: "any_origin",
  destination: "any_origin"
}

const makeGoogleApiRepository = (): GoogleApiRepository => {
  class GoogleApiRepositoryStub implements GoogleApiRepository {
    handle(user: PostRequest): Promise<GoogleApiResponse> {
      return new Promise(resolve => resolve(API_RESPONSE));
    }
  }

  return new GoogleApiRepositoryStub();
}

const makeDriversRepositoryStub = (): DriversRepository => {
  class DriversRepositoryStub implements DriversRepository {
    handle(): Promise<Driver[]> {
      return new Promise(resolve => resolve(DRIVERS));
    }
  }

  return new DriversRepositoryStub();
}

interface SutTypes {
  sut: EstimateUseCaseAdapter
  googleApiRepositoryStub: GoogleApiRepository
  driversRepositoryStub: DriversRepository
}

const makeSut = (): SutTypes => {
  const googleApiRepositoryStub = makeGoogleApiRepository();
  const driversRepositoryStub = makeDriversRepositoryStub();
  const sut = new EstimateUseCaseAdapter(googleApiRepositoryStub, driversRepositoryStub);

  return {
    sut,
    googleApiRepositoryStub,
    driversRepositoryStub
  }
}

describe("EstimateUseCaseAdapter", () => {
  it("Should call GoogleApiRepository with correct values", async () => {
    const { sut, googleApiRepositoryStub } = makeSut();

    const repositorySpy = jest.spyOn(googleApiRepositoryStub, "handle");
    await sut.handle(PAYLOAD);

    expect(repositorySpy).toHaveBeenCalledWith(PAYLOAD);
  })

  it("Should throw if GoogleApiRepository throws", async () => {
    const { sut, googleApiRepositoryStub } = makeSut();

    jest.spyOn(googleApiRepositoryStub, "handle").mockImplementationOnce(() => {
      throw new Error();
    })
    const promise = sut.handle(PAYLOAD);

    expect(promise).rejects.toThrow();
  })

  it("Should call DriversRepository", async () => {
    const { sut, driversRepositoryStub } = makeSut();

    const repositorySpy = jest.spyOn(driversRepositoryStub, "handle");
    await sut.handle(PAYLOAD);

    expect(repositorySpy).toHaveBeenCalled();
  })

  it("Should throw if DriversRepository throws", async () => {
    const { sut, driversRepositoryStub } = makeSut();

    jest.spyOn(driversRepositoryStub, "handle").mockImplementationOnce(() => {
      throw new Error();
    })
    const promise = sut.handle(PAYLOAD);

    expect(promise).rejects.toThrow();
  })

  it("Should return the correct values on success", async () => {
    const { sut } = makeSut();

    const response = await sut.handle(PAYLOAD);

    expect(response).toEqual(RESPONSE);
  })
});
