import { AppProps } from "next/app";
import { AuthProvider } from "../components/Common/Providers/AuthProvider";
import { AuthStatus } from "../utils/types";
import { Cookies, CookiesProvider } from "react-cookie";
import { ReactElement } from "react";
import { Request } from "express";
import { getCookieDefault, getCookieSetOptions } from "../utils/cookies";
import { getDirListOfLibrarySubfolders } from "@server/utils/config";
import App from "next/app";
import BluJayThemeProvider from "@client/components/Common/Providers/ThemeProvider";
import GlobalStyle from "@client/components/Common/Styled/GlobalStyle";
import Layout from "../components/Common/Layout/Layout";
import React from "react";
import getAuthStatus from "../../server/utils/auth";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

type NextAppComponentType = typeof App;
interface ExtendedAppProps extends AppProps {
  appCookies: { [key: string]: string | boolean | number };
  authStatus: AuthStatus;
  libraryDirs: string[];
}

const MyApp: Omit<NextAppComponentType, "origGetInitialProps"> = ({
  Component,
  pageProps,
  appCookies,
  authStatus,
  libraryDirs,
}: ExtendedAppProps): ReactElement => {
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
          <BluJayThemeProvider>
            <GlobalStyle />
            <Layout libraryDirs={libraryDirs}>
              <Component {...pageProps} />
            </Layout>
          </BluJayThemeProvider>
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
  let libraryDirs: string[] = [];
  if (typeof window === "undefined") {
    authStatus = await getAuthStatus(initialProps.ctx);
    libraryDirs = await getDirListOfLibrarySubfolders();
  }

  // run the default getInitialProps for the main nextjs initialProps
  const appInitialProps = (await App.getInitialProps(initialProps)) as AppProps;
  return {
    appCookies: request?.cookies ?? [],
    authStatus,
    libraryDirs,
    ...appInitialProps,
  };
};

export default MyApp;
