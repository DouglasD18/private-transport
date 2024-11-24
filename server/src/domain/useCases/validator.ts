import { Validated } from "../models";

export interface Validator {
  handle(data: any): Validated;
}
