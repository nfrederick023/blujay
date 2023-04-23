import { BluJayTheme } from "@client/utils/types";
import React, { FC } from "react";
import styled from "styled-components";

const ContrastTexWrapper = styled.span`
  color: ${(p: { type: ContrastTypes; theme: BluJayTheme }): string => {
    return p.type === "light"
      ? `${p.theme.textContrastLight}`
      : `${p.theme.textContrast};`;
  }};
`;

type ContrastTypes = "light" | "regular";

interface ContrastTextProps {
  children: React.ReactNode;
  type: ContrastTypes;
}

const ContrastText: FC<ContrastTextProps> = ({
  children,
  type,
}: ContrastTextProps) => {
  return <ContrastTexWrapper type={type}>{children}</ContrastTexWrapper>;
};

export default ContrastText;
