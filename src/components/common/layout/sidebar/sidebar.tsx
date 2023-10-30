import { booleanify, getCookieSetOptions } from "@client/utils/cookie";
import { screenSizes } from "@client/utils/theme";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useWindowWidth } from "@react-hook/window-size";
import CategoryButton from "./category-button";
import Logo from "./logo";
import NoSSR from "@mpth/react-no-ssr";
import React, { FC, useEffect, useState } from "react";
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

  ${(p): string => (p.isCollapsed ? "margin-left: -249px;" : "")};

  @media (max-width: ${screenSizes.smallScreenSize}px) {
    position: fixed;
  }

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    position: fixed;
    min-width: 100%;
    height: 100%;
    transition: 100ms;

    ${(p: { isCollapsed: boolean }): string => (p.isCollapsed ? "margin-left: -100%;" : "")}
  }
`;

const SidebarContent = styled.div`
  max-width: 230px;
  min-width: 230px;
  display: flex;
  position: fixed;
  flex-wrap: wrap;
  margin-left: 20px;
  font-weight: 575;

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    max-width: 100%;
    width: 100%;
  }
`;

const Library = styled.div`
  border-left: ${(p): string => p.theme.textContrastLight} 2px solid;
  margin-left: 40px;
  margin-top: 5px;
  width: 100%;
`;

const LogoBackdrop = styled.div`
  position: fixed;
  left: 20px;
  top: 0px;
  z-index: 3;
`;

interface SidebarProps {
  categories: string[];
}

const Sidebar: FC<SidebarProps> = ({ categories }: SidebarProps) => {
  const [cookies] = useCookies(["isTheaterMode", "isSidebarEnabled"]);
  const [selectedPath, setSelctedPath] = useState("");
  const width = useWindowWidth({ wait: 10 });
  const sidebarState = booleanify(cookies.isSidebarEnabled);
  const [, setCookie] = useCookies();
  const location = useRouter();
  const selectedURL = selectedPath.split("/")[1];
  const selectedCategory = selectedPath.toLowerCase();

  useEffect(() => {
    if (width < screenSizes.tabletScreenSize) {
      setCookie("isSidebarEnabled", "true", getCookieSetOptions());
    }
  }, [location]);

  useEffect(() => {
    location.events.on("routeChangeStart", (path: string): void => {
      setSelctedPath(path);
    });

    setSelctedPath(window.location.pathname);
  }, []);

  return (
    <>
      <NoSSR>
        <LogoBackdrop>
          <Logo onlyShowMenu={width < screenSizes.tabletScreenSize} />
        </LogoBackdrop>
        <SidebarWapper isCollapsed={sidebarState}>
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
