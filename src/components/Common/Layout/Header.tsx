import React, { FC } from "react";
import SearchBar from "./SearchBar";
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

const Header: FC = () => {
  return (
    <HeaderWrapper>
      <HeaderContent>
        <SearchBar />
      </HeaderContent>
    </HeaderWrapper>
  );
};

export default Header;
