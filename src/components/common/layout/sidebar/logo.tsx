import { booleanify, getCookieSetOptions } from "@client/utils/cookie";
import { screenSizes } from "@client/utils/constants";
import { useCookies } from "react-cookie";
import Gradient from "../../shared/gradient";
import Link from "next/link";
import React, { FC } from "react";
import styled from "styled-components";

const LogoContainer = styled.div`
  user-select: none;
  display: flex;
  height: 60px;
  padding-right: 16px;
`;

const LogoWrapper = styled.div`
  margin: auto;
  margin-top: 13px;

  @media (max-width: ${screenSizes.smallScreenSize}px) {
    ${(p: { isSidebarEnabled: boolean }): string => (p.isSidebarEnabled ? "" : "display: none;")}
  }
`;

const Icon = styled.i`
  padding-top: 9px;
  padding-right: 48px;
  padding-left: 3px;
  color: ${(p): string => p.theme.textContrast};

  &:before {
    margin-top: 1px;
    position: fixed;
  }

  &:hover {
    color: ${(p): string => p.theme.text};
    cursor: pointer;
  }
`;

const Logo: FC = () => {
  const [cookies, setCookie] = useCookies(["isTheaterMode", "isSidebarEnabled"]);
  const isSidebarEnabled = booleanify(cookies.isSidebarEnabled);

  const handleIsCollapsedChange = (): void => {
    setCookie("isSidebarEnabled", !isSidebarEnabled, getCookieSetOptions());
  };

  return (
    <LogoContainer>
      <Icon className={"bx bx-menu bx-md"} onClick={handleIsCollapsedChange} />
      <LogoWrapper isSidebarEnabled={isSidebarEnabled}>
        <Link href={"/"}>
          <Gradient type="text">
            <h1>BLU</h1>
          </Gradient>
          <h1>JAY</h1>
        </Link>
      </LogoWrapper>
    </LogoContainer>
  );
};

export default Logo;