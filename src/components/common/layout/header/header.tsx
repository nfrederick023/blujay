import React, { FC } from "react";
import SearchBar from "./searchbar";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  height: 40px;
  padding-top: 5px;
  justify-content: center;
  display: flex;
`;

const HeaderContent = styled.div`
  background-color: ${(p): string => p.theme.background};
  position: fixed;
  top: 0;
  width: 100%;
  margin: auto;
  z-index: 2;
`;

interface HeaderProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const Header: FC<HeaderProps> = ({ search, setSearch }: HeaderProps) => {
  return (
    <HeaderWrapper>
      <HeaderContent>
        <SearchBar search={search} setSearch={setSearch} />
      </HeaderContent>
    </HeaderWrapper>
  );
};

export default Header;
