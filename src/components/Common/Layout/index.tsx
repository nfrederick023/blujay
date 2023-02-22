import React, { FC } from "react";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";
import styled from "styled-components";

const FlexContainer = styled.div`
  display: flex;
`;

const MainContent = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  margin: 20px;
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <FlexContainer>
      <Sidebar />
      <MainContent>
        <SearchBar />
        <ContentWrapper>{children}</ContentWrapper>
      </MainContent>
    </FlexContainer>
  );
};

export default Layout;
