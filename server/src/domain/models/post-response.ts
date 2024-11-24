import { Driver, GoogleApiResponse } from ".";

export interface PostResponse extends GoogleApiResponse {
  options: Driver[],
  routeResponse?: object
}

export interface Location {
  latitude: number,
  longitude: number
}
