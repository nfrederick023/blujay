import { booleanify, getCookieSetOptions } from "@client/utils/cookie";
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
`;

const Icon = styled.i`
  padding-top: 10px;
  padding-right: 8px;
  padding-left: 3px;
  color: ${(p): string => p.theme.text};

  &:before {
    margin-top: 1px;
    position: relative;
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
      <LogoWrapper>
        <Link href={"/"} draggable={false}>
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
