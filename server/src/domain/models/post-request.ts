import { GoogleApiPayload } from ".";

export interface PostRequest extends GoogleApiPayload {
  customerId: string;
}