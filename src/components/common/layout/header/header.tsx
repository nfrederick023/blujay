import { BluJayTheme } from "@client/utils/types";
import { getCookieSetOptions } from "@client/utils/cookie";
import { screenSizes } from "@client/utils/constants";
import { useCookies } from "react-cookie";
import DropDown from "../../shared/drop-down";
import React, { FC, useState } from "react";
import SearchBar from "./search-bar";
import router from "next/router";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  background-color: ${(p): string => p.theme.background};
  height: 60px;
  justify-content: center;
  display: flex;
  position: sticky;
  top: 0;
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

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    display: none;
  }
`;

const Icon = styled.i`
  color: ${(p): string => p.theme.textContrast};

  margin: auto 0px auto 15px;
  font-size: 28px;

  &:hover {
    color: ${(p): string => p.theme.text};
    cursor: pointer;
  }
`;

const CogIcon = styled(Icon)`
  color: ${(p: { isFocused: boolean; theme: BluJayTheme }): string =>
    p.isFocused ? `${p.theme.text}` : `${p.theme.textContrast}`};

  font-size: 32px;
`;

const UploadIcon = styled(Icon)`
  margin: auto;
  font-size: 32px;
`;

const FileUploadInput = styled.input`
  display: none;
`;

const FileUploadLabel = styled.label`
  display: flex;
`;

interface HeaderProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setFilesToUpload: React.Dispatch<React.SetStateAction<FileList | null>>;
}

const Header: FC<HeaderProps> = ({ search, setSearch, setFilesToUpload }) => {
  const [isDropDownShown, setIsDropDownShow] = useState(false);
  const [cookies, setCookie] = useCookies(["authToken"]);

  const handleClick = (): void => {
    setIsDropDownShow(!isDropDownShown);
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

  const options = [{ text: "Settings", action: navigateToSetings }];
  if (cookies.authToken) options.push({ text: "Logout", action: handleLogout });
  else options.push({ text: "Login", action: navigateToLogin });

  return (
    <HeaderWrapper>
      <FileUploadInput type="file" id="click-file-upload" onChange={uploadFiles} multiple />
      <SearchBar search={search} setSearch={setSearch} />
      <IconContainer>
        <FileUploadLabel htmlFor="click-file-upload">
          <UploadIcon tabIndex={0} className="bx bx-cloud-upload" />
        </FileUploadLabel>
        <CogIcon tabIndex={0} isFocused={isDropDownShown} onClick={handleClick} className="bx bx-cog" />
      </IconContainer>
      <CogDropDown>
        <DropDown options={options} isShown={isDropDownShown} setIsShown={setIsDropDownShow} />
      </CogDropDown>
    </HeaderWrapper>
  );
};

export default Header;
