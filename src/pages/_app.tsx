import { AppProps } from "next/app";
import { CookieTypes } from "../utils/types";
import { Cookies, CookiesProvider } from "react-cookie";
import { Montserrat } from "next/font/google";
import { blujayTheme, screenSizes } from "@client/utils/constants";
import { getCookieDefault, getCookieSetOptions } from "../utils/cookie";
import { useRouter } from "next/router";
import GlobalFileUpload from "@client/components/common/layout/upload/globalFileUpload";
import Head from "next/head";
import Header from "@client/components/common/layout/header/header";
import LoadBar from "@client/components/common/layout/loadbar";
import React, { ReactElement, useEffect, useState } from "react";
import SearchSlider from "@client/components/common/video-slider/search-slider";
import Sidebar from "@client/components/common/layout/sidebar/sidebar";
import VideoProvider from "@client/components/common/contexts/video-provider";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";

const montserrat = Montserrat({
  subsets: ["latin"],
});

const GlobalStyle = createGlobalStyle`
  html {
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

  html, body {
    margin: 0px;
    font-size: 1.03em;

  }

  h1, h2, h3, h4, h5, h6 {
    display: inline;
    margin: 0px;
  }

  h1 {
    line-height: 100%;
    font-size: 1.9em;
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
  margin: 10px 20px 20px 20px;
`;

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => {
  //TODO: move this state call into a component that doesn't rerender EVERYTHING
  const [search, setSearch] = useState("");
  const router = useRouter();

  // assign default values to cookies if not set, get all cookies and set default if none
  const _cookies = new Cookies();
  const allCookieTypes: CookieTypes[] = ["authToken", "isTheaterMode", "videoVolume", "isSidebarEnabled"];

  allCookieTypes.forEach((cookieType) => {
    if (!_cookies.get(cookieType)) _cookies.set(cookieType, getCookieDefault(cookieType), getCookieSetOptions());
  });

  useEffect(() => {
    const resetSearch = (): void => {
      if (search) {
        setSearch("");
      }
    };

    router.events.on("routeChangeStart", resetSearch);

    return () => {
      router.events.off("routeChangeStart", resetSearch);
    };
  }, []);

  return (
    <CookiesProvider cookies={_cookies}>
      <ThemeProvider theme={blujayTheme}>
        <div className={montserrat.className}>
          <GlobalStyle />
          <Head>
            <title>Blujay</title>
          </Head>
          <LayoutWrapper>
            {router.pathname.includes("/login") ? (
              <Component {...pageProps} />
            ) : (
              <>
                <LoadBar />
                <VideoProvider>
                  <Sidebar />
                  <CenterContent>
                    <Header setSearch={setSearch} />
                    <GlobalFileUpload>
                      <ContentWrapper>
                        {search ? <SearchSlider search={search} /> : <Component {...pageProps} />}
                      </ContentWrapper>
                    </GlobalFileUpload>
                  </CenterContent>
                </VideoProvider>
              </>
            )}
          </LayoutWrapper>
        </div>
      </ThemeProvider>
    </CookiesProvider>
  );
};

export default MyApp;
