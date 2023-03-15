import React, { FC } from "react";
import styled from "styled-components";
import theme from "@client/utils/themes";

const GradientBackground = styled.span`
  background-image: linear-gradient(
    174deg,
    ${theme.highlightLight} 20%,
    ${theme.highlightDark} 80%
  );
  display: block;
`;

const GradientText = styled.span`
  background: linear-gradient(
    174deg,
    ${theme.highlightLight} 20%,
    ${theme.highlightDark} 80%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  width: fit-content;
  display: inline-block;
`;

type GradientType = "background" | "text";

interface GradientProps {
  children: React.ReactNode;
  type: GradientType;
}

const Gradient: FC<GradientProps> = ({ children, type }: GradientProps) => {
  return (
    <>
      {type === "background" && (
        <GradientBackground>{children}</GradientBackground>
      )}
      {type === "text" && <GradientText>{children}</GradientText>}
    </>
  );
};

export default Gradient;
