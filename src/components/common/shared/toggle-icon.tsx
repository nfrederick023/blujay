import React, { FC, MouseEvent } from "react";
import styled from "styled-components";

const Icon = styled.i`
  color: ${(p): string => p.theme.text};
  font-size: 1.25rem;
  display: flex;
  vertical-align: baseline;
  margin-left: auto;
  margin-right: 10px;

  &:hover {
    color: ${(p): string => p.theme.text};
    cursor: pointer;
  }
`;

export interface ToggleIconProps {
  onIcon: string;
  offIcon: string;
  isToggled: boolean;
  onClick?: (e: MouseEvent) => void;
}

const ToggleIcon: FC<ToggleIconProps> = ({ onIcon, offIcon, isToggled, onClick }) => {
  return <Icon className={isToggled ? onIcon : offIcon} onClick={onClick} />;
};

export default ToggleIcon;
