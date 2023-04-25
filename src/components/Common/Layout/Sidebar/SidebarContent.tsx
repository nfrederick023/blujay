"use client";
import { getDirListOfLibrarySubfolders } from "@server/utils/config";
import { screenSizes } from "@client/utils/theme";
import CategoryButton from "./CategoryButton";
import ContrastText from "../../Styled/ContrastText";
import Gradient from "../../Styled/Gradient";
import React, { FC } from "react";
import SideBarButton from "./SideBarButton";
import styled from "styled-components";

const Logo = styled.div`
  width: 100%;
  padding: 5px;
  margin-bottom: 5px;
  text-align: center;
  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    font-size: 1.75em;
    padding-top: 50px;
    padding-left: 20px;
  }
`;

const Library = styled.div`
  border-left: ${(p): string => p.theme.textContrastLight} 2px solid;
  width: 100%;
  margin-top: 5px;
  margin-left: 36px;
`;

export const SidebarContent: () => Promise<JSX.Element> = async () => {
  const libraryDirs = await getDirListOfLibrarySubfolders();

  return (
    <>
      <Logo>
        <Gradient type="text">
          <h1>BLU</h1>
        </Gradient>
        <h1>JAY</h1>
      </Logo>
      <SideBarButton title={"Home"} icon={"bx bx-home-alt-2 bx-sm"} url={""} />

      <SideBarButton
        title={"Favorites"}
        icon={"bx bx-heart bx-sm"}
        url={"favorites"}
      />

      <SideBarButton
        title={"All Videos"}
        icon={"bx bx-list-ul bx-sm"}
        url={"all"}
      />

      <SideBarButton
        title={"Library"}
        icon={"bx bx-folder bx-sm"}
        url={"library"}
      />
      <Library>
        <ContrastText type={"light"}>
          {libraryDirs.map((dir, i) => {
            return <CategoryButton key={i} category={dir} />;
          })}
        </ContrastText>
      </Library>
    </>
  );
};
