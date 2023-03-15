import { useWindowWidth } from "@react-hook/window-size";
import ContrastText from "../Styled/ContrastText";
import Gradient from "../Styled/Gradient";
import NoSSR from "@mpth/react-no-ssr";
import React, { FC, useEffect, useState } from "react";
import SideBarButton from "./SideBarButton";
import styled from "styled-components";
import theme from "@client/utils/themes";

const SidebarWapper = styled.div`
  background: ${theme.backgroundContrast};
  border-right: ${theme.backgroundContrast} 1px solid;

  max-width: 210px;
  min-width: 175px;
  transition: 0.2s;
  padding-top: 20px;
  user-select: none;
  min-height: 100vh;
  z-index: 1;
  width: 20%;

  &:hover {
    transition: 0.2s;
    border-right: ${theme.highlightLight} 1px solid;
  }

  @media (max-width: ${theme.tabletScreenSize}px) {
    position: fixed;
    min-width: 100%;
    height: 100%;

    ${(props: { isCollapsed: boolean }): string =>
      props.isCollapsed ? "min-width: 60px; left: -60px;" : ""}
  }

  ${(props: { isCollapsed: boolean }): string =>
    props.isCollapsed ? "max-width: 48px; min-width: 48px;" : ""}
`;

const SidebarContent = styled.div`
  max-width: inherit;
  min-width: inherit;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  padding-right: 10px;

  @media (max-width: ${theme.tabletScreenSize}px) {
    max-width: 100%;
    width: 100%;
  }
`;

const Logo = styled.div`
  width: 100%;
  padding: 5px;
  margin-bottom: 5px;
  text-align: center;
`;

const BarsIcon = styled.i`
  position: fixed;
  left: 15px;
  top: 6px;
  font-size: 2.5rem !important;
  z-index: 2;
`;

const Library = styled.div`
  border-left: ${theme.textContrastLight} 2px solid;
  width: 100%;
  margin-top: 5px;
  margin-left: 36px;
`;

const LibraryButton = styled.div`
  padding: 7px;
  padding-left: 25px;
`;

interface SidebarProps {
  libraryDirs: string[];
}

const Sidebar: FC<SidebarProps> = ({ libraryDirs }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const width = useWindowWidth({ wait: 10 });

  useEffect(() => {
    if (width <= theme.mobileScreenSize) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, []);

  const handleIsCollapsedChange = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <NoSSR>
        {width <= theme.mobileScreenSize && (
          <BarsIcon
            onClick={handleIsCollapsedChange}
            className="bx bx-menu bx-lg"
          />
        )}
      </NoSSR>
      <SidebarWapper
        isCollapsed={isCollapsed}
        onClick={handleIsCollapsedChange}
      >
        <SidebarContent>
          {!isCollapsed && (
            <>
              <Logo>
                <Gradient type="text">
                  <h1>BLU</h1>
                </Gradient>
                <h1>JAY</h1>
              </Logo>
              <SideBarButton
                title={"Home"}
                icon={"bx bx-home-alt-2 bx-sm"}
                url={"/"}
              />

              <SideBarButton
                title={"Favorites"}
                icon={"bx bx-heart bx-sm"}
                url={"/favorites"}
              />

              <SideBarButton
                title={"All Videos"}
                icon={"bx bx-list-ul bx-sm"}
                url={"/all"}
              />

              <SideBarButton
                title={"Library"}
                icon={"bx bx-folder bx-sm"}
                url={"/library"}
              />
              <Library>
                <ContrastText type={"light"}>
                  {libraryDirs.map((dir) => {
                    return <LibraryButton key={dir}>{dir}</LibraryButton>;
                  })}
                </ContrastText>
              </Library>
            </>
          )}
        </SidebarContent>
      </SidebarWapper>
    </>
  );
};

export default Sidebar;
