
import { AppProps } from "next/app";
import { AuthProvider } from "../contexts/authContext";
import { AuthStatus } from "../types/types";
import { Cookies, CookiesProvider } from "react-cookie";
import { ReactElement } from "react";
import { Request } from "express";
import { ThemeProps, ThemeProvider, createGlobalStyle } from "styled-components";
import { getCookieDefault, getCookieSetOptions } from "../utils/cookies";
import App from "next/app";
import GlobalStyle from "@client/components/Common/Styled/GlobalStyle"; import Layout from "../components/Common/Layout";
import React from "react";
import getAuthStatus from "../../server/utils/auth";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

type NextAppComponentType = typeof App;
interface ExtendedAppProps extends AppProps {
  appCookies: { [key: string]: string | boolean | number };
  authStatus: AuthStatus;
}

const MyApp: Omit<NextAppComponentType, "origGetInitialProps"> = ({ Component, pageProps, appCookies, authStatus }: ExtendedAppProps): ReactElement => {

  // assign default values to cookies if not set
  const cookies = new Cookies(appCookies);
  for (const [cookie, value] of Object.entries(appCookies))
    if (value === "")
      cookies.set(cookie, getCookieDefault(cookie), getCookieSetOptions());

  return (
    <>
      <title>{publicRuntimeConfig.pageTitle}</title>
      <CookiesProvider cookies={cookies}>
        <AuthProvider authStatus={authStatus}>
          <GlobalStyle />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </CookiesProvider>
    </>
  );
};

MyApp.getInitialProps = async (initialProps): Promise<ExtendedAppProps> => {
  const { ctx } = initialProps;

  // cast as request to pull out cookies
  const request = ctx.req as Request | undefined;
  let authStatus = AuthStatus.notAuthenticated;
  if (typeof window === "undefined") {
    authStatus = await getAuthStatus(initialProps.ctx);
  }

  // run the default getInitialProps for the main nextjs initialProps
  const appInitialProps = await App.getInitialProps(initialProps) as AppProps;
  return { appCookies: request?.cookies ?? [], authStatus, ...appInitialProps };
};

export default MyApp;
