import { BluJayTheme, DropDownOption } from "@client/utils/types";
import { getCookieSetOptions } from "@client/utils/cookie";
import { screenSizes } from "@client/utils/constants";
import { useCookies } from "react-cookie";
import DropDown from "../../shared/drop-down";
import Logo from "../sidebar/logo";
import React, { FC, useEffect, useRef, useState } from "react";
import SearchBar from "./search-bar";
import router from "next/router";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  background-color: ${(p): string => p.theme.background};
  height: 60px;
  justify-content: center;
  display: flex;
  position: sticky;
  top: 0px;
  z-index: 2;
`;

const CogDropDown = styled.div`
  position: absolute;
  width: 250px;
  margin-right: 170px;
  right: -150px;
  top: 20px;
`;

const IconContainer = styled.div`
  position: fixed;
  display: flex;
  height: 58px;
  left: calc(100vw - 20px);
  transform: translate(-100%, 0);
  cursor: pointer;

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    display: none;
  }
`;

const CogIcon = styled.i`
  margin: auto 0px auto 15px;
  color: ${(p: { isFocused: boolean; theme: BluJayTheme }): string =>
    p.isFocused ? `${p.theme.text}` : `${p.theme.textContrast}`};
  pointer-events: ${(p): string => (p.isFocused ? "none" : "auto")};
  font-size: 32px;
  padding-bottom: 1px;

  &:hover {
    color: ${(p): string => p.theme.text};
  }
`;

const FileUploadInput = styled.input`
  display: none;
`;

const LogoBackdrop = styled.div`
  position: fixed;
  left: 15px;
  top: 0px;
  z-index: 3;
`;

interface HeaderProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setFilesToUpload: React.Dispatch<React.SetStateAction<FileList | null>>;
}

const Header: FC<HeaderProps> = ({ search, setSearch, setFilesToUpload }) => {
  const [isDropDownShown, setIsDropDownShow] = useState(false);
  const [cookies, setCookie] = useCookies(["authToken"]);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleClick = (): void => {
    setIsDropDownShow(!isDropDownShown);
  };

  const triggerUpload = (): void => {
    if (inputFileRef.current) inputFileRef.current.click();
  };

  const uploadFiles = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFilesToUpload(e.target.files);
  };

  const navigateToLogin = (): void => {
    setIsDropDownShow(false);
    router.push("/login");
  };

  const navigateToSetings = (): void => {
    setIsDropDownShow(false);
    router.push("/settings");
  };

  const handleLogout = (): void => {
    setCookie("authToken", "", getCookieSetOptions());
    setIsDropDownShow(false);
    router.reload();
  };

  const options: DropDownOption[] = [
    { text: "Upload", icon: "bx bx-upload", action: triggerUpload },
    { text: "Settings", icon: "bx bx-cog", action: navigateToSetings },
  ];
  if (cookies.authToken) options.push({ text: "Logout", icon: "bx bx-log-out", action: handleLogout });
  else options.push({ text: "Login", icon: "bx bx-log-in", action: navigateToLogin });

  const [scrollPos, setScrollPos] = useState(0);
  const scrollPosRef = useRef(scrollPos);
  scrollPosRef.current = scrollPos;
  console.log(scrollPosRef.current);

  useEffect(() => {
    const headerSize = -60;
    let previousScrollPosition = 0;
    let currentScrollPosition = 0;

    const getHeaderScroll = (): void => {
      currentScrollPosition = window.scrollY;
      const scrollAmount = currentScrollPosition - previousScrollPosition;
      const newScrollPos = scrollPosRef.current + scrollAmount;
      previousScrollPosition = currentScrollPosition;

      if (newScrollPos < headerSize) {
        setScrollPos(headerSize);
      } else if (newScrollPos > 0) {
        setScrollPos(0);
      } else {
        setScrollPos(newScrollPos);
      }
    };

    window.addEventListener("scroll", getHeaderScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", getHeaderScroll);
    };
  });

  return (
    <HeaderWrapper>
      <FileUploadInput type="file" id="click-file-upload" onChange={uploadFiles} multiple ref={inputFileRef} />
      <LogoBackdrop>
        <Logo />
      </LogoBackdrop>
      <SearchBar search={search} setSearch={setSearch} />
      <IconContainer>
        <CogIcon
          isFocused={isDropDownShown}
          onClick={handleClick}
          className="bx bxs-user-circle"
          draggable={false}
          tabIndex={0}
        />
      </IconContainer>
      <CogDropDown>
        <DropDown options={options} isShown={isDropDownShown} setIsShown={setIsDropDownShow} />
      </CogDropDown>
    </HeaderWrapper>
  );
};

export default Header;
