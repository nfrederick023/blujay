"use client";
import { SidebarContent } from "./Sidebar/SidebarContent";
import React, { FC } from "react";
import Sidebar from "./Sidebar/Sidebar";
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
}

const Layout: FC<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <FlexContainer>
      <Sidebar>
        {/* @ts-expect-error Server Component */}
        <SidebarContent />
      </Sidebar>
      <MainContent>
        <HeaderWrapper>
          <HeaderContent>{/* <SearchBar /> */}</HeaderContent>
        </HeaderWrapper>
        <ContentWrapper>{children}</ContentWrapper>
      </MainContent>
    </FlexContainer>
  );
};

export default Layout;
