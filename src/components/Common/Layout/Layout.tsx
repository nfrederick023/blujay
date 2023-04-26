import React, { FC, useState } from "react";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";
import styled from "styled-components";

const FlexContainer = styled.div`
  display: flex;
`;

const MainContent = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

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

const ContentWrapper = styled.div`
  margin: 20px;
`;

interface LayoutProps {
  children: React.ReactNode;
  categories: string[];
}

const Layout: FC<LayoutProps> = ({ children, categories }: LayoutProps) => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <FlexContainer>
      <Sidebar categories={categories} />
      <MainContent>
        <HeaderWrapper>
          <HeaderContent>
            <SearchBar search={searchInput} setSearch={setSearchInput} />
          </HeaderContent>
        </HeaderWrapper>
        <ContentWrapper>
          {searchInput ? <>searching...</> : <>{children}</>}
        </ContentWrapper>
      </MainContent>
    </FlexContainer>
  );
};

export default Layout;
