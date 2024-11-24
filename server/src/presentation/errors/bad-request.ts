export class BadRequestError extends Error {
  message: string;

  constructor(message: string) {
    super("Bad Resquest Error!");
    this.message = message;
  }

  handle() {
    return {
      "error_code": "INVALID_DATA",
      "error_description": this.message
    };
  }
}