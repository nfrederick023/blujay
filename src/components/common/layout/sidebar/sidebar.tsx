import { booleanify } from "@client/utils/cookie";
import { screenSizes } from "@client/utils/theme";
import { useCookies } from "react-cookie";
import { useWindowWidth } from "@react-hook/window-size";
import CategoryButton from "./category-button";
import Gradient from "../../shared/gradient";
import NoSSR from "@mpth/react-no-ssr";
import React, { FC, useEffect, useState } from "react";
import SideBarButton from "./page-button";
import styled from "styled-components";

const SidebarWapper = styled.div`
  background: ${(p): string => p.theme.backgroundContrast};

  min-width: 210px;
  max-width: 210px;
  transition: 0.2s;
  user-select: none;
  min-height: 100vh;
  position: sticky;
  z-index: 3;
  ${(p): string => (p.isCollapsed ? "margin-left: -209px;" : "")}

  @media (min-width: ${screenSizes.largeScreenSize + 420}px) {
    position: absolute;
  }

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    position: fixed;
    min-width: 100%;
    height: 100%;

    ${(p: { isCollapsed: boolean }): string =>
      p.isCollapsed ? "margin-left: -100%;" : ""}
  }
`;

const SidebarContent = styled.div`
  max-width: inherit;
  min-width: inherit;
  justify-content: center;
  display: flex;
  position: fixed;
  flex-wrap: wrap;
  padding-right: 10px;
  padding-top: 20px;
  margin-left: -2px;

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    max-width: 100%;
    width: 100%;
  }
`;

const Logo = styled.div`
  margin-bottom: 5px;
  text-align: center;
  width: 100%;
  padding: 5px;

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    padding-left: 20px;
    font-size: 1.75em;
    padding-top: 50px;
  }
`;

const BarsIcon = styled.i`
  font-size: 3rem !important;
  verticle-align: middle;
  position: fixed;
  top: -3.5px;
  left: 10px;
  z-index: 2;

  &::before {
    vertical-align: middle;
  }
`;

const Library = styled.div`
  border-left: ${(p): string => p.theme.textContrastLight} 2px solid;
  margin-left: 30px;
  margin-top: 5px;
  width: 100%;
`;

const MinimizeButton = styled.div`
  position: absolute;
  min-width: inherit;
  min-height: 100%;
  z-index: -1;
`;

const ArrowIconContainer = styled.div`
  border-right: ${(p): string => p.theme.backgroundContrast} 1px solid;
  position: absolute;
  right: 0px;
  min-height: inherit;
  width: 20px;

  &:hover {
    transition: 0.2s;
    border-right: ${(p): string => p.theme.highlightLight} 1px solid;
    cursor: pointer;
  }
`;

const ArrowIcon = styled.div`
  position: absolute;
  min-height: inherit;
  right: -10px;
  width: 30px;

  &:hover {
    cursor: pointer;
  }
`;

interface SidebarProps {
  categories: string[];
}

const Sidebar: FC<SidebarProps> = ({ categories }: SidebarProps) => {
  const [cookies, setCookie] = useCookies(["isTheaterMode"]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const width = useWindowWidth({ wait: 10 });

  useEffect(() => {
    if (width <= screenSizes.mobileScreenSize) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, []);

  const handleIsCollapsedChange = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  // this function is unused, but it could be added back to line 152 if I decide I want to keep this later
  // const isInTheatreMode = (): boolean => {
  //   return (
  //     booleanify(cookies.isTheaterMode) &&
  //     window.location.href.includes("/watch/")
  //   );
  // };

  return (
    <>
      <NoSSR>
        <SidebarWapper isCollapsed={isCollapsed}>
          {width <= screenSizes.tabletScreenSize ? (
            <BarsIcon
              onClick={handleIsCollapsedChange}
              className="bx bx-menu bx-lg"
            />
          ) : (
            <MinimizeButton>
              <ArrowIconContainer>
                <ArrowIcon onClick={handleIsCollapsedChange} />
              </ArrowIconContainer>
            </MinimizeButton>
          )}
          <SidebarContent>
            <Logo>
              <Gradient type="text">
                <h1>BLU</h1>
              </Gradient>
              <Gradient type="text" color="silver">
                <h1>JAY</h1>
              </Gradient>
            </Logo>
            <SideBarButton
              title={"Home"}
              icon={"bx bx-home-alt-2 bx-sm"}
              url={""}
            />

            <SideBarButton
              title={"Favorites"}
              icon={"bx bx-heart bx-sm"}
              url={"favorites"}
            />

            <SideBarButton
              title={"All Videos"}
              icon={"bx bx-list-ul bx-sm"}
              url={"all"}
            />

            <SideBarButton
              title={"Library"}
              icon={"bx bx-folder bx-sm"}
              url={"library"}
            />
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
