import Gradient from "../../shared/gradient";
import Link from "next/link";
import React, { FC } from "react";
import styled from "styled-components";

const ButtonWrapper = styled.div`
  width: 100%;
  color: white;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 5px;
  line-height: 5px;
  transition: 0.1s;

  span {
    min-height: 45px;
    max-height: 45px;
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

  return (
    <>
      <ButtonWrapper>
        <Link href={"/" + url}>
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
        </Link>
      </ButtonWrapper>
    </>
  );
};

export default SideBarButton;
