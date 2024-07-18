import { DropDownOption } from "@client/utils/types";
import DropDown from "./drop-down";
import React, { FC, useState } from "react";
import TextField from "./text-field";
import styled from "styled-components";

const ChevronWrapper = styled.div`
  color: ${(p): string => p.theme.text};
  cursor: pointer;
  border-left: 1px solid ${(p): string => p.theme.text};
  padding-left: 5px;
`;

const ChevronIcon = styled.i`
  margin-top: -2px;
`;

const DropDownWrapper = styled.div`
  width: 100cqw;
`;

const Container = styled.div`
  container-type: inline-size;
`;

interface DropDownTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  options: DropDownOption[];
  onEnter?: () => void;
}

const DropDownTextField: FC<DropDownTextFieldProps> = ({ options, onEnter, ...props }) => {
  const [isDropdownShown, setIsDropdownShown] = useState(false);

  const onClick = (): void => {
    setIsDropdownShown(!isDropdownShown);
  };

  return (
    <Container>
      <TextField
        onEnter={onEnter}
        toggleIcon={
          <ChevronWrapper onClick={onClick}>
            <ChevronIcon className="bx bx-chevron-down bx-sm" onClick={onClick} />
          </ChevronWrapper>
        }
        {...props}
      />
      <DropDownWrapper>
        <DropDown
          options={options}
          isShown={isDropdownShown}
          top={0}
          left={0}
          setIsShown={setIsDropdownShown}
          hasBorder
        />
      </DropDownWrapper>
    </Container>
  );
};

export default DropDownTextField;
