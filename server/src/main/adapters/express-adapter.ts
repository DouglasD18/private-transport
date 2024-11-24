import { Request, Response } from "express";
import { HttpRequest } from "../../presentation/protocols/http";
import { Controller } from "../../presentation/protocols/controller";

export const expressAdapter = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params
    }
    
    const httpResponse = await controller.handle(httpRequest);

    res.status(httpResponse.statusCode).json(httpResponse.body);
  }
}
