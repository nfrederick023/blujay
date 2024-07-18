import { BluJayTheme } from "@client/utils/types";
import React, { FC, KeyboardEvent, ReactNode, useRef, useState } from "react";
import styled from "styled-components";

const TextFieldContent = styled.div`
  border: 1px solid ${(p): string => p.theme.textContrast};
  background-color: ${(p): string => p.theme.background};
  border-radius: 5px;
  color: ${(p): string => p.theme.textContrast};
  display: flex;
  padding: 5px;
  max-height: 32px;
  min-height: 32px;

  ${(p: { isFocused: boolean; theme: BluJayTheme }): string =>
    p.isFocused ? `border: 1px solid ${p.theme.highlightLight};` : ""}

  &:hover {
    cursor: text;
  }
`;

const TextFieldInput = styled.input`
  border: 0px;
  margin: 0px 0px 0px 2px;
  color: ${(p): string => p.theme.text};
  background-color: rgba(0, 0, 0, 0);
  width: 100%;

  &:focus {
    outline: none;
  }

  ::placeholder {
    color: ${(p): string => p.theme.textContrast};
  }
`;

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onEnter?: () => void;
  prefix?: string;
  toggleIcon?: ReactNode;
  innerRef?: React.RefObject<HTMLInputElement>;
}

const TextField: FC<TextFieldProps> = ({ prefix, toggleIcon, onEnter, innerRef, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const input = innerRef ?? useRef<HTMLInputElement>(null);

  const handleClick = (): void => {
    input.current?.focus();
  };

  const onFocus = (): void => {
    setIsFocused(true);
  };

  const onBlur = (): void => {
    setIsFocused(false);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && onEnter) {
      onEnter();
    }
  };

  return (
    <TextFieldContent onClick={handleClick} tabIndex={0} onFocus={onFocus} onBlur={onBlur} isFocused={isFocused}>
      {prefix}
      <TextFieldInput ref={input} onKeyUp={handleKeyUp} {...props} />
      {toggleIcon && toggleIcon}
    </TextFieldContent>
  );
};

export default TextField;
