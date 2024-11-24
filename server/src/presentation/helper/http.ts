import { BadRequestError, InternalServerError } from "../errors";
import { HttpResponse } from "../protocols";

export const badRequest = (error: BadRequestError): HttpResponse => ({
  statusCode: 400,
  body: error.handle()
});

export const internalServerError = (): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError()
});

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body
})
