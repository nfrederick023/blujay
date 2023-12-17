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
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 2;
`;

const CogDropDown = styled.span`
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
  right: 20px;

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

const Header: FC<HeaderProps> = ({ search, setSearch, setFilesToUpload }: HeaderProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isUnselectedFocus, setIsUnselectedFocus] = useState(false);
  const [cookies, setCookie] = useCookies(["authToken"]);

  const handleClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setIsFocused(!isFocused);
  };

  const uploadFiles = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFilesToUpload(e.target.files);
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
      <FileUploadInput type="file" id="click-file-upload" onChange={uploadFiles} multiple />
      <SearchBar search={search} setSearch={setSearch} />
      <IconContainer>
        <FileUploadLabel htmlFor="click-file-upload">
          <UploadIcon tabIndex={0} className="bx bx-cloud-upload" />
        </FileUploadLabel>
        <CogIcon tabIndex={0} isFocused={isFocused} onClick={handleClick} onBlur={onBlur} className="bx bx-cog" />
      </IconContainer>
      <div>
        <CogDropDown onClick={prevent} onMouseDown={mouseDown} onMouseUp={mouseUp}>
          {isFocused && <DropDown options={options}></DropDown>}
        </CogDropDown>
      </div>
    </HeaderWrapper>
  );
};

export default Header;
