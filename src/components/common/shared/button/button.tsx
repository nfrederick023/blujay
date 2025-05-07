import { screenSizes } from "@client/utils/constants";
import React, { ButtonHTMLAttributes, FC, MouseEvent, useEffect, useRef, useState } from "react";
import styled, { RuleSet, css } from "styled-components";

export type BaseButtonCSSProps = {
  isSelected?: boolean;
  isDisabled?: boolean;
  variant?: ButtonVariants;
};
type PositionType = "start" | "end" | "center";
type ButtonVariants = "default" | "error";

const borderRadius = 8;
const height = 38;
const padding = 8;
const animationDuration = 750;

export const baseButtonCSS = css<BaseButtonCSSProps>`
  ${(p): RuleSet<object> => {
    const baseColor = p.variant === "error" ? p.theme.error : p.isSelected ? p.theme.highlight : p.theme.button;
    const baseHoverColor =
      p.variant === "error" ? p.theme.errorLight : p.isSelected ? p.theme.highlightLight : p.theme.buttonLight;

    return css`
      display: flex;
      user-select: none;
      align-items: center;
      white-space: pre;
      background-color: ${baseColor};
      border: ${baseColor} 2px solid;
      cursor: ${p.isDisabled ? "not-allowed;" : "pointer"};
      opacity: ${p.isDisabled ? "0.5" : "1"};
      color: ${p.theme.text};
      padding: ${padding}px;
      border-radius: ${borderRadius}px;
      min-height: ${height}px;
      max-height: ${height}px;
      min-width: ${height}px;
      margin: 2px;

      i {
        margin-top: auto;
        margin-bottom: auto;
        padding-right: 1px;
        font-size: 1.1em !important;

        &:has(+ div) {
          margin-right: 8px;
        }
      }

      &:hover {
        background-color: ${baseHoverColor};
        border-color: ${baseHoverColor};
      }

      &:not(:is(:focus-visible, :hover)) {
        .hover-text {
          visibility: hidden;
        }
      }
    `;
  }};
`;

export const Button = styled.button<BaseButtonCSSProps & { position: PositionType }>`
  justify-content: ${(p): string => p.position};
  ${baseButtonCSS}
`;

const HoverText = styled.div<{ position: PositionType }>`
  ${(p): RuleSet<object> => {
    const hoverTextPosition = p.position !== "center" ? (p.position === "end" ? padding : -1 * padding) : 0;

    return css`
      position: absolute;
      align-content: center;
      border-radius: ${borderRadius}px;
      justify-self: center;
      padding: ${padding}px;
      height: ${height}px;
      z-index: 2;
      background: ${p.theme.button};
      transform: translate(${hoverTextPosition}px, 120%);

      @media (max-width: ${screenSizes.mobileScreenSize}px) {
        display: none;
      }
    `;
  }};
`;

const ConfirmationHoverText = styled(HoverText)`
  @keyframes fadeInOut {
    0% {
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  animation: fadeInOut ${animationDuration}ms linear 1 forwards;
`;

export interface ButtonIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  selectedIcon?: string;
  text?: string;
  textSelected?: string;
  isSelected?: boolean;
  confrimText?: string;
  confrimTextSelected?: string;
  showChevron?: boolean;
  isDisabled?: boolean;
  variant?: "default" | "error";
  isCondensed?: boolean;
  onClick?: (e: MouseEvent) => void;
}

const ButtonIcon: FC<ButtonIconProps> = (props) => {
  const [position, setPosition] = useState<PositionType>("center");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const hoverEl = useRef<HTMLDivElement>(null);

  const handleClick = (e: MouseEvent): void => {
    if (!props.isDisabled) {
      props.onClick?.(e);
      if (props.confrimText || props.confrimTextSelected) {
        setShowConfirmation(true);
        setTimeout(() => {
          setShowConfirmation(false);
        }, animationDuration);
      }
    }
  };

  useEffect((): void => {
    if (hoverEl.current) {
      const rect = hoverEl.current.getBoundingClientRect();
      if (rect.x + rect.width >= window.innerWidth) {
        setPosition("end");
      }
      if (rect.x <= 0) {
        setPosition("start");
      }
    }
  }, []);

  let currentIcon = props.icon;
  let currentText = props.text;
  let currentConfirmText = props.confrimText;

  if (props.isSelected) {
    currentIcon = props.selectedIcon ?? currentIcon;
    currentText = props.textSelected ?? currentText;
    currentConfirmText = props.confrimTextSelected ?? currentConfirmText;
  }

  return (
    <Button
      onClick={handleClick}
      isSelected={!!props.isSelected}
      isDisabled={!!props.isDisabled}
      variant={props.variant ?? "default"}
      position={position}
      {...props}
    >
      {props.isCondensed && !showConfirmation && (
        <HoverText ref={hoverEl} className="hover-text" position={position}>
          {currentText}
        </HoverText>
      )}
      {currentConfirmText && showConfirmation && (
        <ConfirmationHoverText position={position}>{currentConfirmText}</ConfirmationHoverText>
      )}
      {currentIcon && <i className={currentIcon} />}
      {!props.isCondensed && currentText && <div>{currentText}</div>}
      {props.showChevron &&
        (props.isSelected ? <i className={"bx-chevron-down"} /> : <i className={"bx-chevron-up"} />)}
    </Button>
  );
};

export default ButtonIcon;
