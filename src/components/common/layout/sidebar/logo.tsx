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

const MenuButton = styled.button`
  margin-right: 4px;
  margin-top: 8px;
  margin-bottom: 13px;
  background-color: unset;
  padding: 0px;
  border: unset;

  &:hover {
    cursor: pointer;
  }
`;

const Icon = styled.i`
  color: ${(p): string => p.theme.text};
`;

const Logo: FC = () => {
  const [cookies, setCookie] = useCookies(["isTheaterMode", "isSidebarEnabled"]);
  const isSidebarEnabled = booleanify(cookies.isSidebarEnabled);

  const handleIsCollapsedChange = (): void => {
    setCookie("isSidebarEnabled", !isSidebarEnabled, getCookieSetOptions());
  };

  return (
    <LogoContainer>
      <MenuButton onClick={handleIsCollapsedChange}>
        <Icon className={"bx-menu bx-md"} />
      </MenuButton>
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
