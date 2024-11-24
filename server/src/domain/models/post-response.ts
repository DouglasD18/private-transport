import { Driver } from ".";

export interface PostResponse {
  origin: Location,
  destination: Location,
  distance: number,
  duration: number,
  options: [
    Driver
  ],
  routeResponse?: object
}

export interface Location {
  latitude: number,
  longitude: number
}
