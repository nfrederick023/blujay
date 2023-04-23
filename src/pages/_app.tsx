import { AppProps } from "next/app";
import { AuthProvider } from "../components/Common/Providers/AuthProvider";
import { AuthStatus, PublicConfig } from "../utils/types";
import { ConfigProvider } from "@client/components/Common/Providers/ConfigProvider";
import { Cookies, CookiesProvider } from "react-cookie";
import { ReactElement } from "react";
import { Request } from "express";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "@client/utils/themes";
import { getCookieDefault, getCookieSetOptions } from "../utils/cookies";
import {
  getDirListOfLibrarySubfolders,
  getThumnailSettings,
} from "@server/utils/config";
import App from "next/app";
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
  publicConfig: PublicConfig;
}

const MyApp: Omit<NextAppComponentType, "origGetInitialProps"> = ({
  Component,
  pageProps,
  appCookies,
  authStatus,
  libraryDirs,
  publicConfig,
}: ExtendedAppProps): ReactElement => {
  // assign default values to cookies if not set
  const cookies = new Cookies(appCookies);
  for (const [cookie, value] of Object.entries(appCookies))
    if (value === "")
      cookies.set(cookie, getCookieDefault(cookie), getCookieSetOptions());

  const theme = cookies.get("isDarkMode") === "true" ? darkTheme : lightTheme;

  return (
    <>
      <title>{publicRuntimeConfig.pageTitle}</title>
      <CookiesProvider cookies={cookies}>
        <AuthProvider authStatus={authStatus}>
          <ConfigProvider publicConfig={publicConfig}>
            <ThemeProvider theme={theme}>
              <GlobalStyle />
              <Layout libraryDirs={libraryDirs}>
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </ConfigProvider>
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
  authStatus = await getAuthStatus(initialProps.ctx);
  libraryDirs = await getDirListOfLibrarySubfolders();
  const thumbnailSettings = await getThumnailSettings();

  // obviously, DO NOT! pass the full config to the onto MyApp. It contains the password.
  // so pull out what we want and send that by itself

  const publicConfig: PublicConfig = {
    thumbnailSettings,
  };

  // run the default getInitialProps for the main nextjs initialProps
  const appInitialProps = (await App.getInitialProps(initialProps)) as AppProps;
  return {
    appCookies: request?.cookies ?? [],
    authStatus,
    libraryDirs,
    publicConfig,
    ...appInitialProps,
  };
};

export default MyApp;
