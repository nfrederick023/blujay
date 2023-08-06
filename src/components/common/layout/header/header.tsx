import { BluJayTheme } from "@client/utils/types";
import { getCookieSetOptions } from "@client/utils/cookie";
import { useCookies } from "react-cookie";
import DropDown from "../../shared/drop-down";
import React, { FC, useState } from "react";
import SearchBar from "./searchbar";
import router from "next/router";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  background-color: ${(p): string => p.theme.background};
  height: 60px;
  justify-content: center;
  display: flex;
  width: 100%;
  position: sticky;
  top: 0; /* required */
  z-index: 2;
`;

const CogDropDown = styled.span`
  position: absolute;
  width: 250px;
  margin-right: 170px;
  right: -170px;
  top: 20px;
`;

const CogContainer = styled.div`
  width: 0px;
`;

const CogIcon = styled.i`
  color: ${(p: { isFocused: boolean; theme: BluJayTheme }): string =>
    p.isFocused ? `${p.theme.text}` : `${p.theme.textContrast}`};
  margin: auto 0px auto 0px;
  font-size: 28px;
  transition: 0.2s;
  padding-bottom: 1px;

  &:hover {
    color: ${(p): string => p.theme.text};
    cursor: pointer;
  }
`;

interface HeaderProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const Header: FC<HeaderProps> = ({ setSearch }: HeaderProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isUnselectedFocus, setIsUnselectedFocus] = useState(false);
  const [cookies, setCookie] = useCookies(["authToken"]);

  const handleClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setIsFocused(!isFocused);
  };

  const prevent = (e: React.MouseEvent): void => {
    e.stopPropagation();
  };
  const mouseDown = (): void => {
    setIsUnselectedFocus(true);
  };

  const mouseUp = (): void => {
    setIsUnselectedFocus(false);
  };

  const onBlur = (): void => {
    if (!isUnselectedFocus) setIsFocused(false);
  };

  const navigateToLogin = (): void => {
    setIsFocused(false);
    router.push("/login");
  };

  const navigateToSetings = (): void => {
    setIsFocused(false);
    router.push("/settings");
  };

  const handleLogout = (): void => {
    setCookie("authToken", "", getCookieSetOptions());
    setIsFocused(false);
    router.reload();
  };

  const options = [{ text: "Settings", action: navigateToSetings }];
  if (cookies.authToken) options.push({ text: "Logout", action: handleLogout });
  else options.push({ text: "Login", action: navigateToLogin });

  return (
    <HeaderWrapper>
      <SearchBar setSearch={setSearch} />
      <CogContainer>
        <CogIcon tabIndex={0} isFocused={isFocused} onClick={handleClick} onBlur={onBlur} className="bx bx-cog" />
      </CogContainer>
      <div>
        <CogDropDown onClick={prevent} onMouseDown={mouseDown} onMouseUp={mouseUp}>
          {isFocused && <DropDown options={options}></DropDown>}
        </CogDropDown>
      </div>
    </HeaderWrapper>
  );
};

export default Header;
