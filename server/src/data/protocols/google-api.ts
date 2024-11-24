import { GoogleApiPayload, GoogleApiResponse } from "@/domain/models";

export interface GoogleApiRepository {
  handle(payload: GoogleApiPayload): Promise<GoogleApiResponse>;
}