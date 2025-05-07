import React, {
  DetailedHTMLProps,
  FC,
  InputHTMLAttributes,
  KeyboardEvent,
  MouseEventHandler,
  RefObject,
  useRef,
} from "react";
import styled, { RuleSet, css } from "styled-components";

const Label = styled.div`
  margin-bottom: 5px;
`;

const TextFieldContent = styled.div`
  ${(p): RuleSet<object> => css`
    border: 1px solid ${p.theme.textContrast};
    background-color: ${p.theme.background};
    color: ${p.theme.textContrast};
    width: 100%;
    border-radius: 5px;
    min-height: 32px;
    max-height: 32px;

    &:focus-within {
      border: 1px solid ${p.theme.text};
    }

    &:hover {
      cursor: text;
    }
  `}
`;

const TextFieldInput = styled.input`
  border: 0px;
  color: ${(p): string => p.theme.text};
  background-color: rgba(0, 0, 0, 0);
  width: 100%;
  height: 30px;
  text-indent: 4px;

  &:focus {
    outline: none;
  }

  ::placeholder {
    color: ${(p): string => p.theme.textContrast};
  }
`;

interface InputPropsBase extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: string;
  ref?: RefObject<HTMLInputElement>;
}
type InputProps = InputPropsBase &
  ({ icon: string; iconOnClick?: MouseEventHandler<HTMLButtonElement> } | { icon?: never; iconOnClick?: never });

const Input: FC<InputProps> = (props) => {
  const inputRef = props.ref ?? useRef<HTMLInputElement>(null);

  const handleClick = (): void => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    e.stopPropagation();
  };

  return (
    <>
      {props.label && <Label>{props.label}</Label>}
      <TextFieldContent onClick={handleClick}>
        <TextFieldInput ref={inputRef} onKeyDown={handleKeyDown} onChange={props.onChange} {...props} />
        {props.icon && (
          <button onClick={props.iconOnClick}>
            <i className={props.icon} />
          </button>
        )}
      </TextFieldContent>
    </>
  );
};

export default Input;
