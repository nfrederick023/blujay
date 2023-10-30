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
`;

interface HorizontalSliderHeaderProps {
  setPosition: React.Dispatch<React.SetStateAction<number>>;
  displayedPosition: number;
  isMaxOffset: boolean;
  position: number;
  headerText: string;
}

const HorizontalSliderHeader: FC<HorizontalSliderHeaderProps> = ({
  displayedPosition,
  isMaxOffset,
  setPosition,
  headerText,
  position,
}: HorizontalSliderHeaderProps) => {
  const handleIncrementOffset = (): void => {
    if (!isMaxOffset && displayedPosition === position) setPosition(position + 1);
  };

  const handleDecrementOffset = (): void => {
    if (position && displayedPosition === position) setPosition(position - 1);
  };

  return (
    <SliderHeader headerText={headerText} sliderType="horizontal">
      <ChevronIcon className={"bx bx-chevron-left"} isEnabled={!!position} onClick={handleDecrementOffset} />
      <ChevronIcon className={"bx bx-chevron-right"} isEnabled={!isMaxOffset} onClick={handleIncrementOffset} />
    </SliderHeader>
  );
};

export default HorizontalSliderHeader;
