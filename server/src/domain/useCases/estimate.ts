import { PostRequest, PostResponse } from "../models";

export interface EstimateUseCase {
  handle(payload: PostRequest): Promise<PostResponse>
}
