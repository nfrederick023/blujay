import Gradient from "../../shared/gradient";
import React, { FC } from "react";
import styled from "styled-components";

const ButtonWrapper = styled.div`
  width: 100%;
  color: ${(p): string => p.theme.textContrast};
  border-radius: 5px;
  margin-left: 10px;
  line-height: 5px;

  height: 38px;

  > span {
    border-radius: 12px;
    height: 34px;
    align-items: center;
    display: flex;
    padding-left: 8px;
  }
`;

const Icon = styled.i`
  padding-right: 10px;
  vertical-align: middle;
`;

const WhiteColor = styled.div`
  color: white;
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
            <WhiteColor>
              <Icon className={icon} />
              {title}
            </WhiteColor>
          </Gradient>
        ) : (
          <span>
            <Icon className={icon} />
            {title}
          </span>
        )}
      </ButtonWrapper>
    </>
  );
};

export default SideBarButton;
