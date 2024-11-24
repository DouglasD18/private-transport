import { Driver } from "@/domain/models";

export interface DriversRepository {
  handle(): Promise<Driver[]>;
}