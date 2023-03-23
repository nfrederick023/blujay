import ContrastText from "../Styled/ContrastText";
import Gradient from "../Styled/Gradient";
import React, { FC } from "react";
import styled from "styled-components";

const ButtonWrapper = styled.div`
  width: 100%;
  padding: 7px;
  border-radius: 5px;
  margin-left: 10px;
  line-height: 5px;
  span {
    border-radius: 12px;
    height: 38px;
    padding-left: 8px;
    padding-top: 2px;
  }
`;

const Icon = styled.i`
  padding-right: 10px;
  position: relative;
  font-size: 1.5rem !important;
  top: 1px;
`;

interface SideBarButtonProps {
  title: string;
  icon: string;
  url: string;
}

const SideBarButton: FC<SideBarButtonProps> = ({
  title,
  icon,
  url,
}: SideBarButtonProps) => {
  const isSelected = window.location.pathname.split("/")[1] === url;

  return (
    <>
      <ButtonWrapper>
        {isSelected ? (
          <Gradient type="background">
            <Icon className={icon}></Icon>
            {title}
          </Gradient>
        ) : (
          <ContrastText type={"light"}>
            <Icon className={icon}></Icon>
            {title}
          </ContrastText>
        )}
      </ButtonWrapper>
    </>
  );
};

export default SideBarButton;
