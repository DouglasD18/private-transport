import { Validated, PostRequest, PostResponse, Driver, Location } from "@/domain/models";
import { EstimateUseCase, Validator } from "@/domain/useCases";
import { EstimateController } from "@/presentation/controllers";
import { BadRequestError } from "@/presentation/errors";
import { badRequest, internalServerError } from "@/presentation/helper/http";
import { HttpRequest } from "@/presentation/protocols";

const VALIDATED: Validated = {
  isValid: true
}

const REQUEST: HttpRequest = {
  body: {
    origin: "any_origin",
    destination: "any_origin",
    customerId: "any_id"
  }
}

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

const ORIGIN: Location = {
  latitude: 5,
  longitude: 22
}

const DESTINATION: Location = {
  latitude: 18,
  longitude: 99
}

const RESPONSE: PostResponse = {
  origin: ORIGIN,
  destination: DESTINATION,
  distance: 33,
  duration: 78,
  options: [
    DRIVER
  ]
}

const PAYLOAD: PostRequest = {
  customerId: REQUEST.body.customerId,
  origin: REQUEST.body.origin,
  destination: REQUEST.body.destination
}

interface SutTypes {
  sut: EstimateController
  estimateUseCaseStub: EstimateUseCase
  validatorStub: Validator
}

const makeEstimateUseCaseStub = (): EstimateUseCase => {
  class EstimateUseCaseStub implements EstimateUseCase {
    handle(payload: PostRequest): Promise<PostResponse> {
      return new Promise(resolve => resolve(RESPONSE));
    }
  }

  return new EstimateUseCaseStub();
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    handle(body: any): Validated {
      return VALIDATED;
    }
  }

  return new ValidatorStub();
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub();
  const estimateUseCaseStub = makeEstimateUseCaseStub();
  const sut = new EstimateController(estimateUseCaseStub, validatorStub);

  return {
    sut,
    estimateUseCaseStub,
    validatorStub
  }
}

describe('EstimateController', () => {
  it("Should call Validator with correct values", async () => {
    const { sut, validatorStub } = makeSut();

    const ValidateSpy = jest.spyOn(validatorStub, "handle");
    await sut.handle(REQUEST);

    expect(ValidateSpy).toHaveBeenCalledWith(REQUEST.body);
  });

  it('Should return 400 if any param is no provided', async () => {
    const { sut, validatorStub } = makeSut();

    const validated: Validated = {
      isValid: false,
      error: new BadRequestError("Id do usuário precisa ser enviado!")
    }

    jest.spyOn(validatorStub, "handle").mockReturnValue(validated);
    const httpResponse = await sut.handle(REQUEST);
    const validatedError = new BadRequestError("Id do usuário precisa ser enviado!");

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(validatedError.handle());
  });

  it("Should call EstimateUseCase with correct values", async () => {
    const { sut, estimateUseCaseStub } = makeSut();

    const estimateSpy = jest.spyOn(estimateUseCaseStub, "handle");
    await sut.handle(REQUEST);

    expect(estimateSpy).toHaveBeenCalledWith(PAYLOAD);
  });

  it('Should return 500 if EstimateUseCase throws', async () => {
    const { sut, estimateUseCaseStub } = makeSut();

    jest.spyOn(estimateUseCaseStub, "handle").mockImplementation(() => {
      throw new Error();
    })
    const httpResponse = await sut.handle(REQUEST);

    expect(httpResponse).toEqual(internalServerError());
  });

  it('Should return 200 if valid values is provided.', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(REQUEST);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual(RESPONSE);
  });
});