import { useWindowWidth } from "@react-hook/window-size";
import GradientText from "../Styled/GradientText";
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
  top: 3px;
  font-size: 2.5rem !important;
  z-index: 2;
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
      {width <= theme.mobileScreenSize && (
        <BarsIcon
          onClick={handleIsCollapsedChange}
          className="bx bx-menu bx-lg"
        />
      )}

      <SidebarWapper
        isCollapsed={isCollapsed}
        onClick={handleIsCollapsedChange}
      >
        <SidebarContent>
          {!isCollapsed && (
            <>
              <Logo>
                <GradientText>
                  <h1>BLU</h1>
                </GradientText>
                <h1>JAY</h1>
              </Logo>
              <div>
                <SideBarButton
                  title={"Home"}
                  icon={"bx bx-home-alt-2 bx-sm"}
                  url={"/"}
                />

                <SideBarButton
                  title={"Favorites"}
                  icon={"bx bx-heart bx-sm"}
                  url={"/"}
                />
                <SideBarButton
                  title={"All Videos"}
                  icon={"bx bx-list-ul bx-sm"}
                  url={"/"}
                />
                {libraryDirs.map((dir) => {
                  return (
                    <div key={dir}>
                      <br />
                      {dir}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </SidebarContent>
      </SidebarWapper>
    </>
  );
};

export default Sidebar;
