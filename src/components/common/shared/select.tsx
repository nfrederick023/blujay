import { BluJayTheme } from "@client/utils/types";
import DropDown from "./drop-down";
import React, { FC, useState } from "react";
import styled from "styled-components";

const SelectBoxWrapper = styled.div`
  position: relative;
  user-select: none;
  width: 100%;
`;

const SelectBox = styled.div`
  color: ${(p: { isFocused: boolean; theme: BluJayTheme }): string => p.theme.textContrast};
  display: flex;
  user-select: none;
  transition: 0.2s;

  &:hover {
    color: ${(p): string => p.theme.text};
    cursor: pointer;
  }

  color: ${(p): string => (p.isFocused ? `${p.theme.text}` : "")};
`;

const SelectedBox = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const SelectedOption = styled.div`
  border: ${(p: { isMulti: boolean | undefined; theme: BluJayTheme }): string =>
    p.isMulti ? `1px solid ${p.theme.textContrast};` : "0px solid"};
`;

const SelectedIcon = styled.i`
  padding-top: 1px;

  ::before {
    vertical-align: baseline;
  }
`;

const RightIcons = styled.div`
  text-align: right;
  display: flex;
  max-height: 20px;

  i {
    font-size: 1.25rem;
  }
`;

const ClearButton = styled.div`
  border-right: 1px solid ${(p): string => p.theme.text};
  height: 85%;
`;

const PlaceHolderText = styled.div`
  margin-right: 0px;
  margin-left: 10px;
`;

type SelectOptions = string[] & string;

interface SelectProps {
  options: string[];
  value: string[];
  isMulti?: boolean;
  isClearable?: boolean;
  defaultSelected?: string[];
  onChange: (options: SelectOptions) => void;
}

const Select: FC<SelectProps> = ({ options, value, isMulti, isClearable, defaultSelected, onChange }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnselectedFocus, setIsUnselectedFocus] = useState(false);
  const handleAddOption = (option: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    let newOptions: string[];
    if (isMulti) {
      newOptions = [...value, option];
      onChange(newOptions as SelectOptions);
    } else {
      newOptions = [option];
      onChange(option as SelectOptions);
      setIsOpen(false);
    }
  };

  const handleRemoveOption = (option: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const newOptions = [...value.filter((selectedOption) => selectedOption !== option)];
    onChange(newOptions as SelectOptions);
  };

  const handleRemoveAll = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (isMulti) {
      onChange([] as string[] as SelectOptions);
    } else {
      onChange(defaultSelected ? (defaultSelected as SelectOptions) : ("Select..." as SelectOptions));
    }
  };

  const handleClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const mouseDown = (): void => {
    setIsUnselectedFocus(true);
  };

  const mouseUp = (): void => {
    setIsUnselectedFocus(false);
  };

  const onBlur = (): void => {
    if (!isUnselectedFocus) {
      setIsOpen(false);
    }
  };

  const unselectedOptions = options
    .filter((option) => !value.includes(option))
    .map((option) => {
      return { text: option, action: handleAddOption(option) };
    });

  return (
    <SelectBoxWrapper>
      <SelectBox
        tabIndex={0}
        onClick={handleClick}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
        onBlur={onBlur}
        isFocused={isOpen}
      >
        <SelectedBox>
          {value.length ? (
            <>
              {value.map((selectedOption, i) => {
                return (
                  <SelectedOption key={i} isMulti={isMulti}>
                    {selectedOption}
                    {isMulti && (
                      <SelectedIcon className="bx bx-x" onClick={handleRemoveOption(selectedOption)}></SelectedIcon>
                    )}
                  </SelectedOption>
                );
              })}
            </>
          ) : (
            <PlaceHolderText>Select...</PlaceHolderText>
          )}
        </SelectedBox>
        <RightIcons>
          {isClearable && (
            <ClearButton onClick={handleRemoveAll}>
              <i className="bx bx-x"></i>
            </ClearButton>
          )}
          <div>
            <i className="bx bx-chevron-down"></i>
          </div>
        </RightIcons>
      </SelectBox>

      {isOpen && (
        <div tabIndex={0} onMouseDown={mouseDown} onMouseUp={mouseUp} onBlur={onBlur}>
          <DropDown options={unselectedOptions}></DropDown>
        </div>
      )}
    </SelectBoxWrapper>
  );
};

export default Select;
