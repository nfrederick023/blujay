import { LoginDetails } from "./login.dto";
import { LoginFailedException } from "./login.exceptions";
import { checkHashedPassword, hashPassword } from "@server/utils/auth";

export const login = async (loginDetails: LoginDetails): Promise<string> => {
  const hashedRequestPassword = await hashPassword(loginDetails.password);

  if (checkHashedPassword(hashedRequestPassword))
    return hashedRequestPassword;

  throw new LoginFailedException();
};
