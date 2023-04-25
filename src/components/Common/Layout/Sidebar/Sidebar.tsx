"use client";
import { screenSizes } from "@client/utils/theme";
import { useWindowWidth } from "@react-hook/window-size";
import CategoryButton from "./CategoryButton";
import ContrastText from "../../Styled/ContrastText";
import Gradient from "../../Styled/Gradient";
import NoSSR from "@mpth/react-no-ssr";
import React, { FC, useEffect, useState } from "react";
import SideBarButton from "./SideBarButton";
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

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    position: fixed;
    min-width: 100%;
    height: 100%;

    ${(p: { isCollapsed: boolean }): string =>
      p.isCollapsed ? "min-width: 60px; left: -60px;" : ""}
  }

  ${(p): string => (p.isCollapsed ? "max-width: 48px; min-width: 48px;" : "")}
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

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    max-width: 100%;
    width: 100%;
  }
`;

const Logo = styled.div`
  width: 100%;
  padding: 5px;
  margin-bottom: 5px;
  text-align: center;
  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    font-size: 1.75em;
    padding-top: 50px;
    padding-left: 20px;
  }
`;

const BarsIcon = styled.i`
  position: fixed;
  verticle-align: middle;
  left: 10px;
  top: -3.5px;
  font-size: 3rem !important;
  z-index: 2;

  &::before {
    vertical-align: middle;
  }
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
  children: React.ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ children }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
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

  return (
    <>
      <SidebarWapper isCollapsed={isCollapsed}>
        <NoSSR>
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
        </NoSSR>
        <SidebarContent>{!isCollapsed && <>{children}</>}</SidebarContent>
      </SidebarWapper>
    </>
  );
};

export default Sidebar;
