import { booleanify, getCookieSetOptions } from "@client/utils/cookie";
import { screenSizes } from "@client/utils/theme";
import { useCookies } from "react-cookie";
import Gradient from "../../shared/gradient";
import React, { FC } from "react";
import styled from "styled-components";

const LogoContainer = styled.div`
  user-select: none;
  display: flex;
  height: 60px;
  padding-right: 16px;
  ${(p: { onlyShowMenu: boolean }): string => (p.onlyShowMenu ? "width: 32px;" : "width: 210px;")}

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    ${(p: { onlyShowMenu: boolean }): string => (p.onlyShowMenu ? "width: 32px;" : "width: 210px;")}
  }
`;

const LogoWrapper = styled.div`
  margin: auto;
`;

const Icon = styled.i`
  padding-top: 9px;
  padding-right: 48px;
  padding-left: 3px;

  &:before {
    margin-top: 2.2px;
    position: fixed;
  }

  &:hover {
    cursor: pointer;
  }
`;

interface LogoProps {
  onlyShowMenu?: boolean;
}

const Logo: FC<LogoProps> = ({ onlyShowMenu }: LogoProps) => {
  const [cookies, setCookie] = useCookies(["isTheaterMode", "isSidebarEnabled"]);
  const sidebarState = booleanify(cookies.isSidebarEnabled);

  const handleIsCollapsedChange = (): void => {
    setCookie("isSidebarEnabled", !sidebarState, getCookieSetOptions());
  };

  return (
    <LogoContainer onlyShowMenu={onlyShowMenu ?? false}>
      <Icon className={"bx bx-menu bx-md"} onClick={handleIsCollapsedChange} />
      <LogoWrapper>
        {!onlyShowMenu && (
          <>
            <Gradient type="text">
              <h1>BLU</h1>
            </Gradient>
            <h1>JAY</h1>
          </>
        )}
      </LogoWrapper>
    </LogoContainer>
  );
};

export default Logo;
