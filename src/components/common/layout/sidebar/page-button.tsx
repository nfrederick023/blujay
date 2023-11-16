import Gradient from "../../shared/gradient";
import Link from "next/link";
import React, { FC } from "react";
import styled from "styled-components";

const ButtonWrapper = styled.div`
  width: 100%;
  color: white;
  margin-bottom: 5px;
  line-height: 5px;
  transition: 0.1s;

  span {
    min-height: 40px;
    max-height: 40px;
    border-radius: 10px;
    align-items: center;
    display: flex;
    padding-left: 8px;
    height: inherit;
  }
`;

const Icon = styled.i`
  padding-right: 10px;
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
  selectedURL: string;
}

const SideBarButton: FC<SideBarButtonProps> = ({ title, icon, url, selectedURL }: SideBarButtonProps) => {
  return (
    <>
      <ButtonWrapper>
        <Link href={"/" + url}>
          {selectedURL === url ? (
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
