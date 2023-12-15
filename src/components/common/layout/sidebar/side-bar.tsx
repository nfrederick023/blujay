import { VideoContext } from "../../contexts/video-context";
import { booleanify, getCookieSetOptions } from "@client/utils/cookie";
import { screenSizes } from "@client/utils/constants";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import CategoryButton from "./category-button";
import Logo from "./logo";
import NoSSR from "@mpth/react-no-ssr";
import React, { FC, useContext, useEffect, useState } from "react";
import SideBarButton from "./page-button";
import styled from "styled-components";

const SidebarWapper = styled.div`
  min-height: 100%;
  background: ${(p): string => p.theme.backgroundContrast};
  min-width: 250px;
  max-width: 250px;
  user-select: none;
  position: sticky;
  top: 0px;
  z-index: 4;
  min-height: 100vh;
  transition: 0.05s;

  ${(p): string => (p.isSidebarEnabled ? "" : "margin-left: -250px;")};

  @media (max-width: ${screenSizes.smallScreenSize}px) {
    position: fixed;
    transition: 100ms;
  }

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    position: fixed;
    min-width: 100%;
    height: 100%;

    ${(p: { isSidebarEnabled: boolean }): string => (p.isSidebarEnabled ? "" : "margin-left: -100%;")}
  }
`;

const SidebarContent = styled.div`
  max-width: inherit;
  min-width: inherit;
  display: flex;
  position: fixed;
  flex-wrap: wrap;
  padding-left: 15px;
  padding-right: 15px;
  font-weight: 575;

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    max-width: 100%;
    width: 100%;
  }
`;

const Library = styled.div`
  border-left: ${(p): string => p.theme.textContrastLight} 2px solid;
  margin-left: 20px;
  margin-top: 5px;
  width: 100%;
`;

const LogoBackdrop = styled.div`
  position: fixed;
  left: 15px;
  top: 0px;
  z-index: 3;
`;

const Sidebar: FC = () => {
  const [cookies] = useCookies(["isTheaterMode", "isSidebarEnabled"]);
  const [selectedPath, setSelctedPath] = useState("");
  const { videos } = useContext(VideoContext);
  const isSidebarEnabled = booleanify(cookies.isSidebarEnabled);
  const [, setCookie] = useCookies();
  const router = useRouter();
  const selectedURL = selectedPath.split("/")[1];
  const selectedCategory = selectedPath.toLowerCase();
  const categories = [...new Set(videos.map((video) => video.category))]
    .filter((category) => category)
    .sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    const setPathAndCloseSidebar = (path: string): void => {
      if (window.innerWidth < screenSizes.smallScreenSize) {
        setCookie("isSidebarEnabled", "false", getCookieSetOptions());
      }

      setSelctedPath(path);
    };

    setSelctedPath(window.location.pathname);
    router.events.on("routeChangeStart", setPathAndCloseSidebar);

    return () => {
      router.events.off("routeChangeStart", setPathAndCloseSidebar);
    };
  }, []);

  return (
    <>
      <NoSSR>
        <LogoBackdrop>
          <Logo />
        </LogoBackdrop>
        <SidebarWapper isSidebarEnabled={isSidebarEnabled}>
          <SidebarContent>
            <Logo />
            <SideBarButton title={"Home"} icon={"bx bx-home-alt-2 bx-sm"} url={""} selectedURL={selectedURL} />

            <SideBarButton title={"Favorites"} icon={"bx bx-heart bx-sm"} url={"favorites"} selectedURL={selectedURL} />

            <SideBarButton title={"All Videos"} icon={"bx bx-list-ul bx-sm"} url={"all"} selectedURL={selectedURL} />

            <SideBarButton title={"Library"} icon={"bx bx-folder bx-sm"} url={"library"} selectedURL={selectedURL} />
            <Library>
              {categories.map((dir, i) => {
                return <CategoryButton key={i} category={dir} selectedCategory={selectedCategory} />;
              })}
            </Library>
          </SidebarContent>
        </SidebarWapper>
      </NoSSR>
    </>
  );
};

export default Sidebar;
