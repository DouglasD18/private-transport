import { GoogleApiRepository } from "@/data/protocols";
import { GoogleApiPayload, GoogleApiResponse } from "@/domain/models";

import 'dotenv/config';

const DISTANCE_MATRIX_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json';
const GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const KEY = process.env.GOOGLE_API_KEY;

export class GoogleApiRepositoryAdapter implements GoogleApiRepository {
  async handle(payload: GoogleApiPayload): Promise<GoogleApiResponse> {
    const { origin, destination } = payload;

    const distanceMatrixResponse = await fetch(
      `${DISTANCE_MATRIX_URL}?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${KEY}&language=pt`
    );

    if (!distanceMatrixResponse.ok) {
      throw new Error('Erro ao consultar Distance Matrix API.');
    }

    const distanceMatrixData = await distanceMatrixResponse.json();

    const element = distanceMatrixData.rows[0]?.elements[0];
    if (!element || element.status !== 'OK') {
      throw new Error(`Erro ao calcular distância. Status: ${element?.status}`);
    }

    const distance = element.distance.value;
    const duration = element.duration.text;

    const originGeocodeResponse = await fetch(
      `${GEOCODE_URL}?address=${encodeURIComponent(origin)}&key=${KEY}`
    );

    if (!originGeocodeResponse.ok) {
      throw new Error('Erro ao consultar Geocoding API para a origem.');
    }

    const originGeocodeData = await originGeocodeResponse.json();

    const originLocation = originGeocodeData.results[0]?.geometry.location;
    if (!originLocation) {
      throw new Error('Erro ao obter coordenadas da origem.');
    }

    const destinationGeocodeResponse = await fetch(
      `${GEOCODE_URL}?address=${encodeURIComponent(destination)}&key=${KEY}`
    );

    if (!destinationGeocodeResponse.ok) {
      throw new Error('Erro ao consultar Geocoding API para o destino.');
    }

    const destinationGeocodeData = await destinationGeocodeResponse.json();

    const destinationLocation = destinationGeocodeData.results[0]?.geometry.location;
    if (!destinationLocation) {
      throw new Error('Erro ao obter coordenadas do destino.');
    }

    return {
      distance,
      duration,
      origin: {
        latitude: originLocation.lat,
        longitude: originLocation.lng,
      },
      destination: {
        latitude: destinationLocation.lat,
        longitude: destinationLocation.lng,
      }
    };
  }
}

