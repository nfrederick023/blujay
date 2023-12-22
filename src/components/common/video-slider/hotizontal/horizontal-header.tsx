import { BluJayTheme } from "@client/utils/types";
import React, { FC } from "react";
import SliderHeader from "../header";
import styled from "styled-components";
const ChevronIcon = styled.div`
  color: ${(p): string => p.theme.textContrast};
  font-size: 1.25rem;
  transition: 0.2s;
  vertical-align: baseline;
  margin-left: auto;
  margin-right: 5px;

  &:hover {
    color: ${(p): string => p.theme.text};
    cursor: pointer;
  }

  opacity: ${(p: { isEnabled: boolean; theme: BluJayTheme }): number => (p.isEnabled ? 1 : 0.5)};

  &:hover {
    color: ${(p): string => (p.isEnabled ? p.theme.text : p.theme.textContrast)};
    cursor: ${(p): string => (p.isEnabled ? "pointer" : "auto")};
  }

  font-size: 1.5rem;
`;

interface HorizontalSliderHeaderProps {
  incrementVideo: () => void;
  decrementVideo: () => void;
  isStart: boolean;
  isEnd: boolean;
  headerText: string;
}

const HorizontalSliderHeader: FC<HorizontalSliderHeaderProps> = ({
  isStart,
  isEnd,
  incrementVideo,
  decrementVideo,
  headerText,
}) => {
  return (
    <SliderHeader headerText={headerText} sliderType="horizontal">
      <ChevronIcon className={"bx bx-chevron-left"} isEnabled={!isStart} onClick={decrementVideo} />
      <ChevronIcon className={"bx bx-chevron-right"} isEnabled={!isEnd} onClick={incrementVideo} />
    </SliderHeader>
  );
};

export default HorizontalSliderHeader;
