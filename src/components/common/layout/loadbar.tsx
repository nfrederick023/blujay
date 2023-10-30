import React, { FC, useRef } from "react";
import styled from "styled-components";

const loadDurationMS = 2000;
const intialPercentage = 80;

const BlueBar = styled.div`
  position: fixed;
  width: ${intialPercentage}%;
  transition: ${loadDurationMS}ms ease-out;
  height: 2px;
  background-color: ${(p): string => p.theme.highlightDark};
  border-radius: 5px;
  z-index: 5;
`;

interface LoadbarProps {
  isLoading: boolean;
}

const LoadBar: FC<LoadbarProps> = ({ isLoading }: LoadbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const tansitionTime = loadDurationMS * (100 - intialPercentage) * 0.01;

  if (!isLoading) {
    ref.current?.setAttribute("style", `transition: ${tansitionTime}ms  ease-out; width: 105%;`);
    setTimeout(() => {
      ref.current?.setAttribute("style", "transition: 0s; width: 0px;");
    }, tansitionTime);
  }

  if (isLoading) {
    ref.current?.setAttribute("style", "");
  }

  return (
    <>
      <BlueBar ref={ref} />
    </>
  );
};

export default LoadBar;
