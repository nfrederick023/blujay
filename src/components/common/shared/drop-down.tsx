import { DropDownOption } from "@client/utils/types";
import React, { FC, useEffect, useRef } from "react";
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
  color: ${(p): string => p.theme.text};
  display: flex;

  &:hover {
    color: ${(p): string => p.theme.text};
    background-color: ${(p): string => p.theme.highlightLight};
    cursor: pointer;
  }
`;

const Icon = styled.i`
  font-size: 25px;
  margin-right: 15px;
`;

const OptionText = styled.div`
  padding-top: 2px;
`;

interface DropDownProps {
  options: DropDownOption[];
  isShown: boolean;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropDown: FC<DropDownProps> = ({ options, isShown, setIsShown }) => {
  const dropDownRef = useRef<HTMLDivElement>(null);

  const onBlur = (): void => {
    setIsShown(false);
  };

  useEffect(() => {
    if (dropDownRef && isShown) {
      dropDownRef.current?.focus();
    }
  }, [isShown]);

  return (
    <>
      {isShown ? (
        <DropDownBox tabIndex={0} onBlur={onBlur} ref={dropDownRef}>
          {options.length ? (
            <>
              {options.map((option, i) => {
                return (
                  <Option key={i} onClick={option.action}>
                    {option.icon ? <Icon className={option.icon} /> : <></>}
                    <OptionText>{option.text}</OptionText>
                  </Option>
                );
              })}
            </>
          ) : (
            <Option>No Options</Option>
          )}
        </DropDownBox>
      ) : (
        <></>
      )}
    </>
  );
};

export default DropDown;
