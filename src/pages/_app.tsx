import { AppProps } from "next/app";
import { AuthStatus, BluJayTheme, CookieTypes, Video } from "../utils/types";
import { Cookies, CookiesProvider } from "react-cookie";
import { ReactElement, useState } from "react";
import { checkHashedPassword } from "@server/utils/auth";
import { darkTheme, lightTheme, screenSizes } from "@client/utils/theme";
import { getCookieDefault, getCookieSetOptions } from "../utils/cookie";
import { getPrivateLibrary, getVideoList } from "@server/utils/config";
import { useRouter } from "next/router";
import App from "next/app";
import Header from "@client/components/common/layout/header/header";
import React from "react";
import Sidebar from "@client/components/common/layout/sidebar/sidebar";
import VideoSlider from "@client/components/common/video-slider/video-slider";
import cookies from "next-cookies";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
html {
  font-family: 'Montserrat';
  background-color: ${(p): string => p.theme.background};
  color: ${(p): string => p.theme.text};
}

// fixes sidebar positioning somehow 
* {
   box-sizing: border-box;
}

// prevents content shift on scrollbar
// actually this is probably a bad thing tbh 
/* body {
  width: calc(100vw - 15px);
} */

html, body {
  margin: 0px;
  font-size: 1.03em;

}

h1, h2, h3, h4, h5, h6 {
  display: inline;
  margin: 0px;
}

h1 {
  line-height: 75%;
  font-size: 2.20em;
  font-weight: 900;
}

h2 {
  font-size: 1.9em;
  font-weight: 725;
}

h4 {
  font-size: 1.6em;
  font-weight: 575;
}

h5{
  font-size: 1em;
  font-weight: 500;
}

h6{
  font-size: 0.83em;
  font-weight: 500;
}

input, textarea, select { 
  font-family:inherit; 
  font-size: inherit; 
}
`;

const LayoutWrapper = styled.div`
  display: flex;
`;

const CenterContent = styled.div`
  max-width: ${screenSizes.largeScreenSize}px;
  margin: 0 auto 0 auto;
  width: 100%;
`;

const ContentWrapper = styled.div`
  margin: 0px 30px 30px 30px;
`;

type NextAppComponentType = typeof App;
interface ExtendedAppProps extends AppProps {
  videos: Video[];
  theme: BluJayTheme;
}

const MyApp: Omit<NextAppComponentType, "origGetInitialProps"> = ({
  Component,
  pageProps,
  theme,
  videos,
}: ExtendedAppProps): ReactElement => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  // assign default values to cookies if not set
  // get all cookies and set default if none
  const _cookies = new Cookies();
  const allCookieTypes: CookieTypes[] = ["authToken", "isDarkMode", "isTheaterMode", "videoVolume", "isSidebarEnabled"];

  allCookieTypes.forEach((cookieType) => {
    if (!_cookies.get(cookieType)) _cookies.set(cookieType, getCookieDefault(cookieType), getCookieSetOptions());
  });

  const categories = [...new Set(videos.map((video) => video.category))].filter((category) => category);

  const searchResults = videos.filter((video) => video.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <title>title</title>
      <CookiesProvider cookies={_cookies}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <LayoutWrapper>
            {router.pathname.includes("/login") ? (
              <Component {...pageProps} />
            ) : (
              <>
                <Sidebar categories={categories} />
                <CenterContent>
                  <ContentWrapper>
                    <Header setSearch={setSearch} />
                    {search ? (
                      <VideoSlider videos={searchResults} sliderType={"verticle"} headerText={"Search Results"} />
                    ) : (
                      <Component {...pageProps} />
                    )}
                  </ContentWrapper>
                </CenterContent>
              </>
            )}
          </LayoutWrapper>
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
  const authStatus = checkHashedPassword(authToken ?? "");
  const isPrivateLibrary = getPrivateLibrary();

  if (!authStatus && ctx.res) {
    if (authToken) ctx.res.setHeader("Set-Cookie", "authToken=; path=/;");
    if (isPrivateLibrary && !((ctx.req?.url ?? "") === "/login")) {
      ctx.res.writeHead(302, { Location: "/login" });
      ctx.res.end();
    }
  }

  const theme = cookies(ctx).isDarkMode === "false" ? lightTheme : darkTheme;

  // get the remaining app props...
  const appInitialProps = (await App.getInitialProps(initialProps)) as AppProps;
  return {
    videos,
    theme,
    ...appInitialProps,
  };
};

export default MyApp;
