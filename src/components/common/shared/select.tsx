import { BluJayTheme } from "@client/utils/types";
import React, { FC, useState } from "react";
import styled from "styled-components";

const SelectBoxWrapper = styled.div`
  position: relative;
  user-select: none;
  width: 100%;
`;

const SelectBox = styled.div`
  color: ${(p): string => p.theme.textContrast};
  display: flex;
  user-select: none;

  &:hover {
    color: ${(p): string => p.theme.text};
    cursor: pointer;
  }

  color: ${(p: { isFocused: boolean; theme: BluJayTheme }): string =>
    p.isFocused ? `${p.theme.text}` : ""};
`;

const UnselectedBox = styled.div`
  position: absolute;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
  transition: 1s;
  width: 110%;
  padding: 5px;
  background-color: ${(p): string => p.theme.background};
  border-left: 3px solid ${(p): string => p.theme.highlightLight};
  z-index: 2;
  left: -20px;

  &:hover {
    border-left: 3px solid ${(p): string => p.theme.highlightDark};
  }
`;

const UnselectedOption = styled.div`
  padding: 5px;
  color: ${(p): string => p.theme.textContrast};
  transition: 0.15s;

  &:hover {
    color: ${(p): string => p.theme.text};
    cursor: pointer;
    border-radius: 5px;
  }
`;

const SelectedBox = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const SelectedOption = styled.div`
  font-size: 85%;

  border: ${(p: { isMulti: boolean | undefined; theme: BluJayTheme }): string =>
    p.isMulti
      ? `1px solid ${p.theme.textContrast};`
      : "border: 0px; font-size: 1rem;"};
`;

const SelectedIcon = styled.i`
  font-size: 110%;
  padding-top: 1px;
  margin-right: 3px;

  ::before {
    vertical-align: baseline;
  }
`;

const RightIcons = styled.i`
  text-align: right;
  display: flex;

  i {
    font-size: 1.25rem;
    vertical-align: baseline;
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

const Select: FC<SelectProps> = ({
  options,
  value,
  isMulti,
  isClearable,
  defaultSelected,
  onChange,
}: SelectProps) => {
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
    const newOptions = [
      ...value.filter((selectedOption) => selectedOption !== option),
    ];
    onChange(newOptions as SelectOptions);
  };

  const handleRemoveAll = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (isMulti) {
      onChange([] as string[] as SelectOptions);
    } else {
      onChange(
        defaultSelected
          ? (defaultSelected as SelectOptions)
          : ("Select..." as SelectOptions)
      );
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

  const unselectedOptions = options.filter((option) => !value.includes(option));

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
                      <SelectedIcon
                        className="bx bx-x"
                        onClick={handleRemoveOption(selectedOption)}
                      ></SelectedIcon>
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
        <UnselectedBox
          tabIndex={0}
          onMouseDown={mouseDown}
          onMouseUp={mouseUp}
          onBlur={onBlur}
        >
          {unselectedOptions.length ? (
            <>
              {unselectedOptions.map((option, i) => {
                return (
                  <UnselectedOption key={i} onClick={handleAddOption(option)}>
                    {option}
                  </UnselectedOption>
                );
              })}
            </>
          ) : (
            <UnselectedOption>No Options</UnselectedOption>
          )}
        </UnselectedBox>
      )}
    </SelectBoxWrapper>
  );
};

export default Select;
