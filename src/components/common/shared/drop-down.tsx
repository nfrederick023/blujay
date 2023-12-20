import React, { FC } from "react";
import styled from "styled-components";

const DropDownBox = styled.div`
  position: absolute;
  padding: 10px 0px 10px 0px;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
  transition: 1s;
  width: 100%;
  border-radius: 15px;
  background-color: ${(p): string => p.theme.backgroundContrast};
  z-index: 2;
  top: 30px;
  user-select: none;
`;

const Option = styled.div`
  padding: 8px 8px 8px 15px;
  color: ${(p): string => p.theme.textContrast};

  &:hover {
    color: ${(p): string => p.theme.text};
    background-color: ${(p): string => p.theme.highlightLight};
    cursor: pointer;
  }
`;

interface DropDownOption {
  text: string;
  action: (e: React.MouseEvent) => void;
}

interface DropDownProps {
  options: DropDownOption[];
}

const DropDown: FC<DropDownProps> = ({ options }) => {
  return (
    <DropDownBox>
      {options.length ? (
        <>
          {options.map((option, i) => {
            return (
              <Option key={i} onClick={option.action}>
                {option.text}
              </Option>
            );
          })}
        </>
      ) : (
        <Option>No Options</Option>
      )}
    </DropDownBox>
  );
};

export default DropDown;
