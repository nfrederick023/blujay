import { HttpException } from "next-api-decorators";

export class LoginFailedException extends HttpException {
  public constructor(message = "Login Failed") {
    super(400, message);
  }
}