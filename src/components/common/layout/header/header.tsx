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
  background-color: ${(p: { theme: BluJayTheme; scrolledDown: boolean }): string => p.theme.background};
  height: 60px;
  justify-content: center;
  display: flex;
  position: sticky;
  top: 0px;
  z-index: 2;
  transition: 250ms;

  /* @media (max-width: ${screenSizes.tabletScreenSize}px) {
    top: ${(p: { scrolledDown: boolean }): string => (p.scrolledDown ? "-60px" : "0px")};
  } */
`;

const IconContainer = styled.div`
  position: absolute;
  right: 20px;
  display: flex;
  height: 58px;
  user-select: none;

  @media (max-width: ${screenSizes.mobileScreenSize}px) {
    right: 10px;
  }
`;

const CogWrapper = styled.div`
  display: flex;
`;

const CogIcon = styled.i`
  margin: auto;
  color: ${(p: { isFocused: boolean; theme: BluJayTheme }): string =>
    p.isFocused ? `${p.theme.text}` : `${p.theme.text}`};
  pointer-events: ${(p): string => (p.isFocused ? "none" : "auto")};
  font-size: 32px;
  padding-bottom: 1px;
  cursor: pointer;
`;

const SearchIcon = styled.i`
  margin: auto 15px auto 10px;
  color: ${(p): string => p.theme.text};
  font-size: 32px;
  padding-bottom: 1px;
  display: none;
  cursor: pointer;

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    display: unset;
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

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    position: absolute;
  }
`;

interface HeaderProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setFilesToUpload: React.Dispatch<React.SetStateAction<FileList | null>>;
}

const Header: FC<HeaderProps> = ({ search, setSearch, setFilesToUpload }) => {
  const [isDropDownShown, setIsDropDownShow] = useState(false);
  const [cookies, setCookie] = useCookies(["authToken"]);
  const [scrolledDown, setScrolledDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
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

  useEffect(() => {
    const getHeaderScroll = (): void => {
      setScrolledDown(window.scrollY > lastScrollY);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", getHeaderScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", getHeaderScroll);
    };
  });

  return (
    <HeaderWrapper scrolledDown={scrolledDown}>
      <FileUploadInput type="file" id="click-file-upload" onChange={uploadFiles} multiple ref={inputFileRef} />
      <LogoBackdrop>
        <Logo />
      </LogoBackdrop>
      <SearchBar search={search} setSearch={setSearch} />
      <IconContainer>
        <SearchIcon className="bx bx-search" draggable={false} tabIndex={0} />
        <CogWrapper>
          <CogIcon
            isFocused={isDropDownShown}
            onClick={handleClick}
            className="bx bxs-user-circle"
            draggable={false}
            tabIndex={0}
          />
          <DropDown
            options={options}
            isShown={isDropDownShown}
            setIsShown={setIsDropDownShow}
            top={50}
            left={32}
            relativePosition="left"
          />
        </CogWrapper>
      </IconContainer>
    </HeaderWrapper>
  );
};

export default Header;
