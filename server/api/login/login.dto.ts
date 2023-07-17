import { IsNotEmpty } from "class-validator";

export class LoginDetails {
  @IsNotEmpty()
  password: string;
}