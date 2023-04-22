import { BluJayTheme } from "@client/utils/types";
import React, { FC } from "react";
import styled from "styled-components";

const ContrastTexWrapper = styled.span`
  color: ${(props): string => props.theme.textContrast};
  ${(props: { type: ContrastTypes; theme: BluJayTheme }): string => {
    if (props.type === "light")
      return `color: ${props.theme.textContrastLight};`;
    if (props.type === "regular") return `color: ${props.theme.textContrast};`;
    return "";
  }}
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
