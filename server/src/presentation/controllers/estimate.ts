import { EstimateUseCase, Validator } from "@/domain/useCases";
import { Controller, HttpRequest, HttpResponse } from "../protocols";
import { BadRequestError } from "../errors";
import { badRequest, internalServerError, ok } from "../helper/http";

export class EstimateController implements Controller {
  private readonly estimateUseCase: EstimateUseCase;
  private readonly validator: Validator;

  constructor(estimateUseCase: EstimateUseCase, validator: Validator) {
    this.estimateUseCase = estimateUseCase;
    this.validator = validator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const validated = this.validator.handle(httpRequest.body);
    if (!validated.isValid) {
      return badRequest(validated.error as unknown as BadRequestError);
    }

    try {
      const { origin, destination, customerId } = httpRequest.body;
      const response = await this.estimateUseCase.handle({
        origin,
        destination,
        customerId
      });

      return ok(response);
    } catch (error) {
      return internalServerError(); 
    }
  }

}
