import React, { FC } from "react";
import styled from "styled-components";
import theme from "@client/utils/themes";

const GradientWrapper = styled.span`
  background: linear-gradient(
    174deg,
    ${theme.highlightDark} 30%,
    ${theme.highlightLight} 70%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  width: fit-content;
  display: inline-block;
`;

interface GradientProps {
  children: React.ReactNode;
}

const GradientText: FC<GradientProps> = ({ children }: GradientProps) => {
  return <GradientWrapper>{children}</GradientWrapper>;
};

export default GradientText;
