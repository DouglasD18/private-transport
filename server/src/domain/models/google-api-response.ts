import { Location } from "./post-response";

export interface GoogleApiResponse {
  distance: number;
  origin: Location;
  destination: Location;
  duration: string;
}
