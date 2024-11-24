import { PostRequest, PostResponse } from "@/domain/models";
import { EstimateUseCase } from "@/domain/useCases";
import { DriversRepository, GoogleApiRepository } from "../protocols";

export class EstimateUseCaseAdapter implements EstimateUseCase {
  private googleApiRepository: GoogleApiRepository;
  private driversRepository: DriversRepository;

  constructor(
    googleApiRepository: GoogleApiRepository,
    driversRepository: DriversRepository
  ) {
    this.googleApiRepository = googleApiRepository;
    this.driversRepository = driversRepository;
  }

  async handle(payload: PostRequest): Promise<PostResponse> {
    const apiResponse = await this.googleApiRepository.handle(payload);
    const drivers = await this.driversRepository.handle();

    const driversResponse = drivers.filter(driver => driver.km <= apiResponse.distance);

    return {
      ...apiResponse,
      options: driversResponse
    };
  }
  
}