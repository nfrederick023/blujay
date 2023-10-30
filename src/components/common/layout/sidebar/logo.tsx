import { booleanify, getCookieSetOptions } from "@client/utils/cookie";
import { screenSizes } from "@client/utils/theme";
import { useCookies } from "react-cookie";
import Gradient from "../../shared/gradient";
import Link from "next/link";
import React, { FC } from "react";
import styled from "styled-components";

const LogoContainer = styled.div`
  user-select: none;
  display: flex;
  height: 60px;
  ${(p: { onlyShowMenu: boolean }): string => (p.onlyShowMenu ? "width: 32px;" : "width: 210px;")}

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    ${(p: { onlyShowMenu: boolean }): string => (p.onlyShowMenu ? "width: 32px;" : "width: 210px;")}
  }
`;

const LogoWrapper = styled.div`
  margin: auto;
`;

const Icon = styled.i`
  padding-top: 10px;
  padding-right: 48px;

  &:before {
    margin-top: 1px;
    margin-left: -5px;
    left: 20px;
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
          <Link href={"/"}>
            <Gradient type="text">
              <h1>BLU</h1>
            </Gradient>
            <h1>JAY</h1>
          </Link>
        )}
      </LogoWrapper>
    </LogoContainer>
  );
};

export default Logo;
