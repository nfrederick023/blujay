import { BluJayTheme } from "@client/utils/types";
import React, { FC, KeyboardEvent, useRef, useState } from "react";
import styled from "styled-components";

const TextFieldContent = styled.div`
  border: 1px solid ${(p): string => p.theme.textContrast};
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

interface TextFieldProps {
  onChange: (text: string) => void;
  onEnter?: () => void;
  value: string;
  placeholder: string;
  inputType: "search" | "password" | "text";
  prefix?: string;
  toggleIcon?: JSX.Element;
}

const TextField: FC<TextFieldProps> = ({
  onChange,
  onEnter,
  value,
  placeholder,
  prefix,
  inputType,
  toggleIcon,
}: TextFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const handleClick = (): void => {
    input.current?.focus();
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>): void => {
    onChange(e.currentTarget.value);
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
      <TextFieldInput
        ref={input}
        onChange={handleInput}
        onKeyUp={handleKeyUp}
        placeholder={placeholder}
        value={value}
        type={inputType}
      />
      <>{toggleIcon ? toggleIcon : {}}</>
    </TextFieldContent>
  );
};

export default TextField;
