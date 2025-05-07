import { screenSizes } from "@client/utils/constants";
import ButtonIcon, { BaseButtonCSSProps, baseButtonCSS } from "./button/button";
import Input from "./input";
import React, { ChangeEvent, FC, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import styled, { RuleSet, css } from "styled-components";

const Select = styled.div`
  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    &,
    button {
      width: 100%;
    }
  }
`;

const OptionWrapper = styled.div`
  position: relative;
  margin: 0px 2px 0px 2px;
`;

const OptionContainer = styled.div`
  position: absolute;
  width: 100%;
  border-radius: 8px;
  border: none;
  background-color: ${(p): string => p.theme.button};
`;

const Option = styled.div<{ isSelected?: boolean; isDisabled?: boolean; focused?: boolean }>`
  ${(p): RuleSet<object> => {
    const focused = css`
      cursor: pointer;
      border-radius: 8px;
      outline-offset: -2px;
      outline: solid 1px white;
    `;

    return css`
      user-select: none;
      padding: 8px;
      color: ${p.theme.text};
      ${p.isSelected && `background-color: ${p.theme.highlight}`};
      ${p.isDisabled && "pointer-events: none;"};

      ${p.focused && focused};

      &:hover {
        cursor: pointer;
        border-radius: 8px;
        filter: brightness(2);
      }

      &:not(:has(i, input)) {
        padding-left: 14px;
      }

      &:has(input) {
        cursor: auto;
      }
    `;
  }}
`;

const Icon = styled.i`
  padding-right: 4px;
`;

type DropDownBase = { text: string };
type DropDownMenu = DropDownBase & { icon?: string; onClick: () => void };
type DropDownSelect = DropDownBase & { icon?: string };
type DropDownMulti = DropDownBase & { selected?: boolean };

interface DropDownPropsBase {
  text: string;
  icon?: string;
  isDisabled?: boolean;
}

interface DropDownMenuProps extends DropDownPropsBase {
  options: DropDownMenu[];
  type: "menu";
}

interface DropDownSelectProps extends DropDownPropsBase {
  options: DropDownSelect[];
  type?: "select";
  selected: DropDownSelect;
  onChange: (value: DropDownSelect) => void;
}

interface DropDownMultiSelectProps extends DropDownPropsBase {
  options: DropDownMulti[];
  type: "multiselect";
  onChange: (value: DropDownMulti[]) => void;
}

type DropDownProps = DropDownMultiSelectProps | DropDownSelectProps | DropDownMenuProps;
type SelectType = DropDownMulti[] | DropDownSelect | undefined;
type DropDownOptions = DropDownProps["options"][number];

const DropDown: FC<DropDownProps> = (props) => {
  const isSelectType = props.type === "select" || !props.type;
  const isMultiType = props.type === "multiselect";
  const isMenuType = props.type === "menu";

  const baseSelect = isSelectType ? props.selected : isMultiType ? props.options.filter((o) => !o.selected) : undefined;
  const [selected, setSelected] = useState<SelectType>(baseSelect);
  const [isOpen, setIsOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLButtonElement>(null);

  const isSelect = isSelectType && ((val: SelectType): val is DropDownSelect => true)(selected);
  const isMulti = isMultiType && ((val: SelectType): val is DropDownMulti[] => true)(selected);
  const isMenu = isMenuType && ((val: SelectType): val is undefined => true)(selected);

  const selectOption = (value: string): void => {
    const option = props.options.find((o) => value === o.text);
    if (option) {
      isMulti &&
        setSelected(isSelected(option) ? selected.filter((s) => s !== option) : [...new Set([...selected, option])]);
      isMenu && (option as DropDownMenu).onClick();
      isSelect && setSelected(option);
    }
  };

  const handleSelectClick = (): void => {
    setIsOpen(!isOpen);
  };

  const handleSelectBlur = (): void => {
    setFocusIndex(-1);
    setIsOpen(false);
  };

  const handleOnChange = (event: ChangeEvent<HTMLButtonElement>): void => {
    selectOption(event.currentTarget.value);
  };

  const preventClose = (event: KeyboardEvent<HTMLOptionElement> | MouseEvent<HTMLOptionElement>): void => {
    if (isMulti) {
      event.preventDefault();
      selectOption(event.currentTarget.value);
    }
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === " " || event.key === "Enter") {
      setFocusIndex(0);
    }

    if (event.key === "Escape") {
      handleSelectBlur();
    }

    if (event.key === "ArrowUp" && focusIndex > 0) {
      setFocusIndex(focusIndex - 1);
    }

    if (event.key === "ArrowDown" && focusIndex < props.options.length - 1) {
      setFocusIndex(focusIndex + 1);
    }
  };

  const handleInputKeydown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Tab") {
      forceCloseDropDown();
    }

    if (event.key === "ArrowDown") {
      const sibling = event?.currentTarget.parentElement?.parentElement?.nextSibling as HTMLOptionElement;
      sibling.focus();
    }
  };

  const isSelected = (option: DropDownOptions): boolean => {
    return (isMulti && selected?.includes(option as DropDownMulti)) || selected === option;
  };

  const forceCloseDropDown = (): void => {
    const oldSize = selectRef.current?.size;
    selectRef.current && (selectRef.current.size = 0);
    setTimeout(() => {
      selectRef.current && oldSize && (selectRef.current.size = oldSize);
    }, 1);
  };

  let text = props.text;
  let icon = props.icon;

  if (isSelect) {
    text = selected?.text;
    icon = selected?.icon;
  }

  if (isMulti && selected.length) {
    text = props.text + ": " + (selected.length > 1 ? selected.length + " selected" : selected[0].text);
  }

  useEffect(() => {
    isMulti || (isSelect && props.onChange(selected));
  }, [selected]);

  return (
    <Select>
      <ButtonIcon
        text={props.text}
        icon={props.icon}
        disabled={props.isDisabled}
        onClick={handleSelectClick}
        onBlur={handleSelectBlur}
        onKeyDown={handleKeyDown}
        isSelected={isOpen}
        showChevron
      ></ButtonIcon>
      {isOpen && (
        <OptionWrapper>
          <OptionContainer>
            {/* <Option>
          <Input ref={inputRef} onKeyDown={handleInputKeydown} placeholder="Add tag"></Input>
        </Option> */}
            {props.options.length ? (
              props.options.map((option, i) => (
                <Option
                  key={i}
                  focused={i === focusIndex}
                  // onMouseUp={preventClose}
                  // onKeyDown={handleKeyDown}
                  isSelected={isSelected(option)}
                >
                  {isMulti ? (
                    <Icon className={selected.includes(option) ? "bx-checkbox-checked" : "bx-checkbox"} />
                  ) : (
                    <Icon className={(option as DropDownMenu | DropDownSelect).icon} />
                  )}
                  {option.text}
                </Option>
              ))
            ) : (
              <Option focused>No Options</Option>
            )}
          </OptionContainer>
        </OptionWrapper>
      )}
    </Select>
  );
};

export default DropDown;
