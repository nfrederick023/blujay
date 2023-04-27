import Gradient from "../shared/gradient";
import React, { FC, ReactNode } from "react";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  align-items: baseline;
  margin-bottom: 10px;
  display: flex;
`;

const HeaderIconsWrapper = styled.div`
  margin-left: auto;
  display: flex;
`;

interface SliderHeaderProps {
  headerText: string;
  children: ReactNode;
}

const SliderHeader: FC<SliderHeaderProps> = ({
  children,
  headerText,
}: SliderHeaderProps) => {
  return (
    <HeaderWrapper>
      <Gradient type="text">
        <h2>{headerText}</h2>
      </Gradient>
      <HeaderIconsWrapper>{children}</HeaderIconsWrapper>
    </HeaderWrapper>
  );
};

export default SliderHeader;
