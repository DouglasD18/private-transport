import { PostBodyValidatorAdapter } from "@/data/useCases";
import { Validated } from "@/domain/models";
import { BadRequestError } from "@/presentation/errors";

const BODY = {
  destination: "destination",
  origin: "origin",
  customerId: "userId"
}

const makeSut = () => {
  return {
    sut: new PostBodyValidatorAdapter()
  }
}

describe('PostBodyValidatorAdapter', () => {
  it("Should return BadRequest with the correct message if destination is not provided", () => {
    const { sut } = makeSut();
    const body = {
      origin: BODY.origin,
      customerId: BODY.customerId
    }

    const validated = sut.handle(body);

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new BadRequestError("O campo destination é obrigatório!"));
  });

  it("Should return BadRequest with the correct message if origin is not provided", () => {
    const { sut } = makeSut();
    const body = {
      destination: BODY.destination,
      customerId: BODY.customerId,
      origin: "      "
    }

    const validated = sut.handle(body);

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new BadRequestError("O campo origin é obrigatório!"));
  });

  it("Should return BadRequest with the correct message if customerId is not provided", () => {
    const { sut } = makeSut();
    const body = {
      origin: BODY.origin,
      destination: BODY.destination
    }

    const validated = sut.handle(body);

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new BadRequestError("O campo customerId é obrigatório!"));
  });

  it("Should return BadRequest with the correct message if destination is equal to origin", () => {
    const { sut } = makeSut();
    const body = {
      origin: BODY.origin,
      customerId: BODY.customerId,
      destination: BODY.origin
    }

    const validated = sut.handle(body);

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new BadRequestError("Os campos detination e origin não podem ser iguais!"));
  });

  it('Should return true if valid values is provided.', () => {
    const { sut } = makeSut();

    const validated = sut.handle(BODY);

    expect(validated.isValid).toBe(true);
    expect(validated.error).toBeFalsy();
  });
});