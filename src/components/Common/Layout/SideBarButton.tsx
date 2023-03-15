import ContrastText from "../Styled/ContrastText";
import React, { FC } from "react";
import styled from "styled-components";

const Button = styled.div`
  width: 100%;
  text-align: left;
  padding: 7px;
  margin-right: 50px;
`;

const Icon = styled.i`
  padding-right: 10px;
`;

type SideBarTitles = "Home" | "Favorites" | "All Videos";

interface SideBarButtonProps {
  title: SideBarTitles;
  icon: string;
  url: string;
}

const SideBarButton: FC<SideBarButtonProps> = ({
  title,
  icon,
}: SideBarButtonProps) => {
  return (
    <Button>
      <ContrastText type={"light"}>
        <Icon className={icon}></Icon>
        {title}
      </ContrastText>
    </Button>
  );
};

export default SideBarButton;
