import React, { FC } from "react";
import SearchBar from "./SearchBar";
import styled from "styled-components";
import theme from "@client/utils/themes";

const HeaderWrapper = styled.div`
  height: 40px;
`;

const HeaderContent = styled.div`
  background-color: ${theme.background};
  position: fixed;
  left: 50%;
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
