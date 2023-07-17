import { Body, Post, ValidationPipe, createHandler } from "next-api-decorators";
import { LoginDetails } from "./login.dto";
import { login } from "./login.service";

class LoginController {
  @Post()
  public async Login(@Body(ValidationPipe) req: LoginDetails): Promise<string> {
    return await login(req);
  }
}

export default createHandler(LoginController);