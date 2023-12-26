import { AliveScope } from "react-activation";
import { CookieTypes, Video } from "../utils/types";
import { Cookies, CookiesProvider } from "react-cookie";
import { KeepAliveProvider } from "react-next-keep-alive";
import { Montserrat } from "next/font/google";
import { blujayTheme, screenSizes } from "@client/utils/constants";
import { getCookieDefault, getCookieSetOptions } from "../utils/cookie";
import { useRouter } from "next/router";
import App, { AppContext, AppInitialProps, AppProps } from "next/app";
import BackToTop from "@client/components/common/layout/back-to-top";
import GlobalFileUpload from "@client/components/common/layout/upload/upload-progress";
import GlobalUploadWrapper from "@client/components/common/layout/upload/gobal-upload-wrapper";
import Head from "next/head";
import Header from "@client/components/common/layout/header/header";
import LoadBar from "@client/components/common/layout/load-bar";
import React, { ReactElement, useEffect, useState } from "react";
import SearchSlider from "@client/components/common/video-slider/search-slider";
import Sidebar from "@client/components/common/layout/sidebar/side-bar";
import UploadProgress from "@client/components/common/layout/upload/upload-progress";
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
  body{
    overflow-y: auto;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar
  {
    width: 5px;
    -webkit-appearance: none;
    background-color: transparent;
  }

  ::-webkit-scrollbar-track-piece
  {
   display:none;
  }

  ::-webkit-scrollbar-thumb
  {
    border-radius: 8px;
    background-color: ${(p): string => p.theme.textContrast};
  }

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    &::-webkit-scrollbar
      {
        width: 0px;
        background-color: transparent;
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
  width: calc(100vw - 5px);

  @media (max-width: ${screenSizes.mobileScreenSize}px) {
    width: unset;
  }
`;

const CenterContent = styled.div`
  max-width: ${screenSizes.largeScreenSize}px;
  margin: 0 auto 0 auto;
  width: 100%;
`;

const ContentWrapper = styled.div`
  margin: 10px 20px 20px 20px;

  @media (max-width: ${screenSizes.mobileScreenSize}px) {
    margin: 10px 10px 20px 10px;
  }
`;

interface MyAppProps {
  intialVideos: Video[];
  cookieString: string | undefined;
}

const MyApp = ({ Component, pageProps, intialVideos, cookieString }: AppProps & MyAppProps): ReactElement => {
  //TODO: move this state call into a component that doesn't rerender EVERYTHING
  const [search, setSearch] = useState("");
  const [isProgressBarShown, setIsProgressBarShown] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<FileList | null>(null);
  const router = useRouter();

  const cookies = new Cookies(cookieString);
  // assign default values to cookies if not set, get all cookies and set default if none
  const allCookieTypes: CookieTypes[] = ["authToken", "isTheaterMode", "videoVolume", "isSidebarEnabled"];
  allCookieTypes.forEach((cookieType) => {
    if (!cookies.get(cookieType)) cookies.set(cookieType, getCookieDefault(cookieType), getCookieSetOptions());
  });

  useEffect(() => {
    if (search) {
      setSearch("");
    }
  }, [router.asPath]);

  return (
    <CookiesProvider cookies={cookies}>
      <ThemeProvider theme={blujayTheme}>
        <VideoProvider intialVideos={intialVideos}>
          <GlobalStyle />
          <Head>
            <title>Blujay</title>
          </Head>
          <LayoutWrapper className={montserrat.className}>
            {router.pathname.includes("/login") ? (
              <Component {...pageProps} />
            ) : (
              <GlobalUploadWrapper setFilesToUpload={setFilesToUpload}>
                <LoadBar />
                <Sidebar />
                <CenterContent>
                  <BackToTop isProgressBarShown={isProgressBarShown} />
                  <UploadProgress
                    filesToUpload={filesToUpload}
                    setFilesToUpload={setFilesToUpload}
                    isProgressBarShown={isProgressBarShown}
                    setIsProgressBarShown={setIsProgressBarShown}
                  />
                  <Header search={search} setSearch={setSearch} setFilesToUpload={setFilesToUpload} />
                  <ContentWrapper>
                    <KeepAliveProvider router={router}>
                      {search ? <SearchSlider search={search} /> : <Component {...pageProps} />}
                    </KeepAliveProvider>
                  </ContentWrapper>
                </CenterContent>
              </GlobalUploadWrapper>
            )}
          </LayoutWrapper>
        </VideoProvider>
      </ThemeProvider>
    </CookiesProvider>
  );
};

MyApp.getInitialProps = async (context: AppContext): Promise<MyAppProps & AppInitialProps> => {
  const ctx = await App.getInitialProps(context);

  let cookieString: string | undefined;
  let intialVideos: Video[] = [];
  if (typeof window === "undefined") {
    cookieString = context.ctx.req?.headers.cookie;
    const cookies = new Cookies(cookieString);
    const authToken = cookies.get("authToken");
    const auth = await import("@server/utils/auth");
    if (context.router.pathname !== "/login") {
      auth.authGuard(context.ctx, authToken);
    }
    intialVideos = await auth.getProtectedVideoList(authToken);
  } else {
    cookieString = document.cookie;
  }

  return { ...ctx, intialVideos, cookieString };
};

export default MyApp;
