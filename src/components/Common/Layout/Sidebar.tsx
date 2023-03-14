import GradientText from "../Styled/GradientText";
import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import theme from "@client/utils/themes";

const SidebarWapper = styled.div`
  max-width: 310px;
  width: 30%;
  background: ${theme.backgroundContrast};
  transition: 0.2s;
  padding-top: 15px;
  user-select: none;
  z-index: 999;

  @media (max-width: ${theme.tabletScreenSize}px) {
    position: absolute;
    min-width: 100%;
    height: 100%;

    ${(props: { isCollapsed: boolean }): string =>
      props.isCollapsed ? "min-width: 60px; left: -60px;" : ""}
  }

  ${(props: { isCollapsed: boolean }): string =>
    props.isCollapsed ? "max-width: 60px" : ""}
`;

const SidebarContent = styled.div`
  position: fixed;
  max-width: inherit;
  width: inherit;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
`;

const BarsIcon = styled.i`
  position: absolute;
  left: 15px;
  @media (max-width: ${theme.tabletScreenSize}px) {
    ${(props: { isCollapsed: boolean }): string =>
      props.isCollapsed ? "left: 75px;" : ""}
  }
`;

interface SidebarProps {
  libraryDirs: string[];
}

const Sidebar: FC<SidebarProps> = ({ libraryDirs }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (window.outerWidth <= theme.tabletScreenSize) {
      setIsCollapsed(true);
    }
  }, []);

  const handleIsCollapsedChange = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SidebarWapper isCollapsed={isCollapsed}>
      <SidebarContent>
        <BarsIcon
          isCollapsed={isCollapsed}
          onClick={handleIsCollapsedChange}
          className="fa fa-bars fa-2xl"
        />

        {!isCollapsed && (
          <>
            <div>
              <GradientText>
                <h1>BLU</h1>
              </GradientText>
              <h1>JAY</h1>
            </div>
            <div>
              Home
              <br />
              Favorites
              <br />
              Library
              {libraryDirs.map((dir) => {
                return <>{dir}</>;
              })}
            </div>
          </>
        )}
      </SidebarContent>
    </SidebarWapper>
  );
};

export default Sidebar;
