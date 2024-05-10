import { VideoContext } from "../../contexts/video-context";
import { booleanify, getCookieSetOptions } from "@client/utils/cookie";
import { screenSizes } from "@client/utils/constants";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import CategoryButton from "./category-button";
import Logo from "./logo";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import SideBarButton from "./page-button";
import styled from "styled-components";

const SidebarBackground = styled.div`
  position: fixed;
  background: ${(p): string => p.theme.backgroundContrast};
  min-height: 100vh;
  min-width: 250px;
  max-width: 250px;

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    min-width: 100%;
  }
`;

const SidebarWapper = styled.div`
  min-height: 100%;
  min-width: 250px;
  max-width: 250px;
  user-select: none;
  position: sticky;
  top: 0px;
  z-index: 4;
  min-height: 100vh;
  /* transition: 0.05s; */

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

const Sidebar: FC = () => {
  const [cookies] = useCookies(["isTheaterMode", "isSidebarEnabled"]);
  const [selectedPath, setSelctedPath] = useState("");
  const selectedURL = selectedPath ? selectedPath.split("/")[1] : "";
  const { videos } = useContext(VideoContext);
  const isSidebarEnabled = booleanify(cookies.isSidebarEnabled);
  const [, setCookie] = useCookies();
  const router = useRouter();
  const selectedPathRef = useRef("");
  const selectedCookieRef = useRef(cookies);
  selectedPathRef.current = selectedPath;
  selectedCookieRef.current = cookies;
  const categories = [...new Set(videos.flatMap((video) => video.categories))]
    .filter((category) => category)
    .sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    const setPathAndCloseSidebar = (path: string): void => {
      if (window.innerWidth < screenSizes.smallScreenSize && booleanify(selectedCookieRef.current.isSidebarEnabled)) {
        setCookie("isSidebarEnabled", "false", getCookieSetOptions());
      }

      if (path === "/" || path === "/all" || path === "/favorites" || path.includes("/library/")) {
        setSelctedPath(path);
        return;
      }

      if (selectedPathRef.current) {
        return;
      } else {
        setSelctedPath("");
      }
    };

    setPathAndCloseSidebar(window.location.pathname);
    router.events.on("routeChangeStart", setPathAndCloseSidebar);

    return () => {
      router.events.off("routeChangeStart", setPathAndCloseSidebar);
    };
  }, []);

  const libraryURL = "library/" + encodeURIComponent(categories[0]);

  return (
    <SidebarWapper isSidebarEnabled={isSidebarEnabled}>
      <SidebarBackground />
      <SidebarContent>
        <Logo />
        <SideBarButton title={"Home"} icon={"bx bx-home-alt-2 bx-sm"} url={""} selectedURL={selectedURL} />

        <SideBarButton title={"Favorites"} icon={"bx bx-heart bx-sm"} url={"favorites"} selectedURL={selectedURL} />

        <SideBarButton title={"All Videos"} icon={"bx bx-list-ul bx-sm"} url={"all"} selectedURL={selectedURL} />

        <SideBarButton title={"Random"} icon={"bx bx-dice-6 bx-sm"} url={"random"} selectedURL={selectedURL} />

        {categories.length ? (
          <SideBarButton title={"Library"} icon={"bx bx-folder bx-sm"} url={libraryURL} selectedURL={selectedURL} />
        ) : (
          <></>
        )}

        <Library>
          {categories.map((dir, i) => {
            return <CategoryButton key={i} category={dir} selectedCategory={selectedPath} />;
          })}
        </Library>
      </SidebarContent>
    </SidebarWapper>
  );
};

export default Sidebar;
