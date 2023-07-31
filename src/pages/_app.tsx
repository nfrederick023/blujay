import { AppProps } from "next/app";
import { BluJayTheme, CookieTypes, Video } from "../utils/types";
import { Cookies, CookiesProvider, useCookies } from "react-cookie";
import { ReactElement, useContext, useEffect, useState } from "react";
import { VideoContext } from "@client/components/common/contexts/video-context";
import { booleanify, getCookieDefault, getCookieSetOptions } from "../utils/cookie";
import { checkHashedPassword, getProtectedVideoList } from "@server/utils/auth";
import { darkTheme, lightTheme, screenSizes } from "@client/utils/theme";
import { getPrivateLibrary } from "@server/utils/config";
import { useRouter } from "next/router";
import App from "next/app";
import Header from "@client/components/common/layout/header/header";
import React from "react";
import Sidebar from "@client/components/common/layout/sidebar/sidebar";
import VideoSlider from "@client/components/common/video-slider/video-slider";
import cookies from "next-cookies";
import styled, { ThemeContext, ThemeProvider, createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
html {
  font-family: 'Montserrat';
  background-color: ${(p): string => p.theme.background};
  color: ${(p): string => p.theme.text};
}

body {
  overflow-y: scroll;
  overflow-x: hidden;

  &::-webkit-scrollbar
  {
    width: 8px;
    background-color: rgba(0,0,0,0.0);
  }

  &::-webkit-scrollbar-thumb
  {
    border-radius: 8px;
    background-color: ${(p): string => p.theme.textContrast};
  }

    @media (max-width: ${screenSizes.tabletScreenSize}px) {
     &::-webkit-scrollbar
      {
        width: 0px;
        background-color: rgba(0,0,0,0.0);
      }
  }
}

a:hover, a:visited, a:link, a:active
{
    text-decoration: none; color: unset;
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

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [cookies] = useCookies(["isDarkMode"]);
  const [theme, setTheme] = useState<BluJayTheme>(darkTheme);

  // assign default values to cookies if not set
  // get all cookies and set default if none
  const _cookies = new Cookies();
  const allCookieTypes: CookieTypes[] = ["authToken", "isDarkMode", "isTheaterMode", "videoVolume", "isSidebarEnabled"];

  allCookieTypes.forEach((cookieType) => {
    if (!_cookies.get(cookieType)) _cookies.set(cookieType, getCookieDefault(cookieType), getCookieSetOptions());
  });

  const categories = [...new Set(videos.map((video) => video.category))].filter((category) => category);
  const searchResults = videos.filter((video) => video.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    setTheme(cookies.isDarkMode === "false" ? lightTheme : darkTheme);
  }, []);

  return (
    <>
      <CookiesProvider cookies={_cookies}>
        <ThemeProvider theme={theme}>
          <VideoContext.Provider value={{ videos, setVideos }}>
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
          </VideoContext.Provider>
        </ThemeProvider>
      </CookiesProvider>
    </>
  );
};

export default MyApp;
