import { AuthStatus } from "../../../utils/types";
import { useRouter } from "next/router";
import React, { FC } from "react";

const AuthContext = React.createContext(AuthStatus.notAuthenticated);
const { Provider } = AuthContext;

interface AuthProviderProps {
  children?: React.ReactNode;
  authStatus: AuthStatus;
}

const AuthProvider: FC<AuthProviderProps> = ({
  children,
  authStatus,
}: AuthProviderProps) => {
  const router = useRouter();
  const protectedRoutes = ["/login"];

  if (typeof window !== "undefined") {
    if (
      protectedRoutes.includes(router.pathname) &&
      authStatus === AuthStatus.notAuthenticated
    )
      router.push("/");
  }

  return (
    <Provider value={authStatus ?? AuthStatus.notAuthenticated}>
      {children}
    </Provider>
  );
};

export { AuthContext, AuthProvider };
