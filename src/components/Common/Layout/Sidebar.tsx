import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import theme from "@client/utils/themes";

const SidebarWapper = styled.div`
  height: 100vh;
  max-width: 310px;
  width: 30%;
  background: ${theme.backgroundContrast};
  transition: 0.2s;
  text-align: center;
  padding-top: 15px;

  @media (max-width: ${theme.tabletScreenSize}px) {
    position: absolute;
    min-width: 100%;

    ${(props: { isCollapsed: boolean }): string =>
      props.isCollapsed ? "min-width: 60px; left: -60px;" : ""}
  }

  ${(props: { isCollapsed: boolean }): string =>
    props.isCollapsed ? "max-width: 60px" : ""}
`;

const BarsIcon = styled.i`
  position: absolute;
  left: 15px;

  @media (max-width: ${theme.tabletScreenSize}px) {
    ${(props: { isCollapsed: boolean }): string =>
      props.isCollapsed ? "left: 75px;" : ""}
  }
`;

const Sidebar: FC = () => {
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
      <BarsIcon
        isCollapsed={isCollapsed}
        onClick={handleIsCollapsedChange}
        className="fa fa-bars fa-2xl"
      />
      {!isCollapsed && (
        <div>
          BlueJay
          <br />
          Home
          <br />
          Favorites
          <br />
          Library
        </div>
      )}
    </SidebarWapper>
  );
};

export default Sidebar;
