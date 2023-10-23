import { booleanify } from "@client/utils/cookie";
import { screenSizes } from "@client/utils/theme";
import { useCookies } from "react-cookie";
import { useWindowWidth } from "@react-hook/window-size";
import CategoryButton from "./category-button";
import Logo from "./logo";
import NoSSR from "@mpth/react-no-ssr";
import React, { FC } from "react";
import SideBarButton from "./page-button";
import styled from "styled-components";

const SidebarWapper = styled.div`
  min-height: 100%;
  background: ${(p): string => p.theme.backgroundContrast};
  min-width: 250px;
  max-width: 250px;
  transition: 0.1s ease-in-out;
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

    ${(p: { isCollapsed: boolean }): string => (p.isCollapsed ? "margin-left: -100%;" : "")}
  }
`;

const SidebarContent = styled.div`
  max-width: inherit;
  min-width: inherit;
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
  const width = useWindowWidth({ wait: 10 });
  const sidebarState = booleanify(cookies.isSidebarEnabled);
  const isCollapsed = width <= screenSizes.mobileScreenSize ? sidebarState : !sidebarState;

  return (
    <>
      <NoSSR>
        <LogoBackdrop>
          <Logo onlyShowMenu={width < screenSizes.tabletScreenSize} />
        </LogoBackdrop>
        <SidebarWapper isCollapsed={isCollapsed}>
          <SidebarContent>
            <Logo />
            <SideBarButton title={"Home"} icon={"bx bx-home-alt-2 bx-sm"} url={""} />

            <SideBarButton title={"Favorites"} icon={"bx bx-heart bx-sm"} url={"favorites"} />

            <SideBarButton title={"All Videos"} icon={"bx bx-list-ul bx-sm"} url={"all"} />

            <SideBarButton title={"Library"} icon={"bx bx-folder bx-sm"} url={"library"} />
            <Library>
              {categories.map((dir, i) => {
                return <CategoryButton key={i} category={dir} />;
              })}
            </Library>
          </SidebarContent>
        </SidebarWapper>
      </NoSSR>
    </>
  );
};

export default Sidebar;
