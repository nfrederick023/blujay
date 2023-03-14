import Header from "./Header";
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
  libraryDirs: string[];
}

const Layout: FC<LayoutProps> = ({ children, libraryDirs }: LayoutProps) => {
  return (
    <FlexContainer>
      <Sidebar libraryDirs={libraryDirs} />
      <MainContent>
        <Header />
        <ContentWrapper>{children}</ContentWrapper>
      </MainContent>
    </FlexContainer>
  );
};

export default Layout;
