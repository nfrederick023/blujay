import { BluJayTheme } from "@client/utils/types";
import React, { FC } from "react";
import styled from "styled-components";

const GradientBackground = styled.span`
  background: linear-gradient(
    170deg,
    ${(p: { color: Color; theme: BluJayTheme }): string =>
        p.color === "blue" ? p.theme.highlightDark : p.theme.hightlightSilver}
      30%,
    ${(p): string => (p.color === "blue" ? p.theme.highlightLight : "white")} 70%
  );
  display: block;
`;

const GradientText = styled.span`
  background: linear-gradient(
    170deg,
    ${(p: { color: Color; theme: BluJayTheme }): string =>
        p.color === "blue" ? p.theme.highlightDark : p.theme.hightlightSilver}
      10%,
    ${(p): string => (p.color === "blue" ? p.theme.highlightLight : "white")} 90%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  width: fit-content;
  display: inline-block;
`;

type GradientType = "background" | "text";
type Color = "silver" | "blue";

interface GradientProps {
  children: React.ReactNode;
  type: GradientType;
  color?: Color;
}

const Gradient: FC<GradientProps> = ({ children, type, color }: GradientProps) => {
  return (
    <>
      {type === "background" && <GradientBackground color={color || "blue"}>{children}</GradientBackground>}
      {type === "text" && <GradientText color={color || "blue"}>{children}</GradientText>}
    </>
  );
};

export default Gradient;
