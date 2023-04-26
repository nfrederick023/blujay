import { AppProps } from "next/app";
import { AuthStatus, BluJayTheme, CookieTypes, Video } from "../utils/types";
import { Cookies, CookiesProvider } from "react-cookie";
import { ReactElement } from "react";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "@client/utils/theme";
import { getCookieDefault, getCookieSetOptions } from "../utils/cookie";
import { getVideoList } from "@server/utils/config";
import App from "next/app";
import GlobalStyle from "@client/components/Common/Styled/GlobalStyle";
import Layout from "../components/Common/Layout/Layout";
import React from "react";
import cookies from "next-cookies";
import getAuthStatus from "../../server/utils/auth";

type NextAppComponentType = typeof App;
interface ExtendedAppProps extends AppProps {
  authStatus: AuthStatus;
  videos: Video[];
  theme: BluJayTheme;
}

const MyApp: Omit<NextAppComponentType, "origGetInitialProps"> = ({
  Component,
  pageProps,
  authStatus,
  theme,
  videos,
}: ExtendedAppProps): ReactElement => {
  // assign default values to cookies if not set

  // get all cookies and set default if none
  const _cookies = new Cookies();
  const allCookieTypes: CookieTypes[] = [
    "authToken",
    "isDarkMode",
    "theaterMode",
    "videoVolume",
  ];

  allCookieTypes.forEach((cookieType) => {
    if (!_cookies.get(cookieType))
      _cookies.set(
        cookieType,
        getCookieDefault(cookieType),
        getCookieSetOptions()
      );
  });

  const categories = [...new Set(videos.map((video) => video.category))].filter(
    (category) => category
  );

  return (
    <>
      <title>title</title>
      <CookiesProvider cookies={_cookies}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Layout categories={categories}>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </CookiesProvider>
    </>
  );
};

MyApp.getInitialProps = async (initialProps): Promise<ExtendedAppProps> => {
  const { ctx } = initialProps;
  const videos = getVideoList();

  // auth stuff
  const authToken = cookies(ctx)?.authToken;
  const authStatus = getAuthStatus(authToken);
  const theme = cookies(ctx)?.isDarkMode === "true" ? darkTheme : lightTheme;

  // if there's a token, the user is not authenticated, and authentication is required
  // then redirect to login and reset
  if (authToken && authStatus === AuthStatus.notAuthenticated && ctx.res) {
    ctx.res.setHeader("Set-Cookie", "authToken=; Max-Age=0");
    ctx.res.setHeader("Location", "/login");
  }

  // get the remaining app props...
  const appInitialProps = (await App.getInitialProps(initialProps)) as AppProps;
  return {
    authStatus,
    videos,
    theme,
    ...appInitialProps,
  };
};

export default MyApp;
