import { SliderType } from "@client/utils/types";
import { screenSizes } from "@client/utils/constants";
import Gradient from "../shared/gradient";
import React, { FC, ReactNode } from "react";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  align-items: baseline;
  margin-bottom: 15px;
  display: flex;

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    ${(p: { sliderType: SliderType }): string => (p.sliderType === "verticle" ? "display: block;" : "")};
  }
`;

const HeaderIconsWrapper = styled.div`
  margin-left: auto;
  display: flex;
  flex-wrap: wrap;

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    ${(p: { sliderType: SliderType }): string => (p.sliderType === "horizontal" ? "display: block;" : "")};
  }
`;

interface SliderHeaderProps {
  headerText: string;
  children: ReactNode;
  sliderType: SliderType;
}

const SliderHeader: FC<SliderHeaderProps> = ({ children, headerText, sliderType }) => {
  return (
    <HeaderWrapper sliderType={sliderType}>
      <Gradient type="text">
        <h2>{headerText}</h2>
      </Gradient>
      <HeaderIconsWrapper sliderType={sliderType}>{children}</HeaderIconsWrapper>
    </HeaderWrapper>
  );
};

export default SliderHeader;
