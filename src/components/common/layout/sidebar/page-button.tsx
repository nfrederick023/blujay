import Gradient from "../../shared/gradient";
import React, { FC } from "react";
import router from "next/router";
import styled from "styled-components";

const ButtonWrapper = styled.div`
  width: 100%;
  color: white;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 5px;
  line-height: 5px;
  transition: 0.1s;
  height: 45px;

  > span {
    border-radius: 10px;
    align-items: center;
    display: flex;
    padding-left: 8px;
    height: inherit;
  }
`;

const Icon = styled.i`
  padding-right: 10px;
  vertical-align: middle;
`;

const Unselected = styled.span`
  color: ${(p): string => p.theme.textContrast};

  &:hover {
    color: ${(p): string => p.theme.text};
    cursor: pointer;
  }
`;

interface SideBarButtonProps {
  title: string;
  icon: string;
  url: string;
}

const SideBarButton: FC<SideBarButtonProps> = ({ title, icon, url }: SideBarButtonProps) => {
  const isSelected = window.location.pathname.split("/")[1] === url;
  const navigateToPage = (): void => {
    router.push("/" + url);
  };
  return (
    <>
      <ButtonWrapper onClick={navigateToPage}>
        {isSelected ? (
          <Gradient type="background">
            <Icon className={icon} />
            {title}
          </Gradient>
        ) : (
          <Unselected>
            <Icon className={icon} />
            {title}
          </Unselected>
        )}
      </ButtonWrapper>
    </>
  );
};

export default SideBarButton;
