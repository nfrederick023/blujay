import { BluJayTheme } from "@client/utils/types";
import { screenSizes } from "@client/utils/constants";
import React, { FC, MouseEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const ButtonWrapper = styled.div`
  display: flex;

  &:focus-visible {
    outline: 0px;
  }
`;

const Button = styled.div`
  user-select: none;
  border-radius: 8px;
  display: grid;
  white-space: pre;
  align-content: center;
  min-height: 38px;
  max-height: 38px;
  min-width: 38px;
  h6 {
    margin-right: 5px;
  }

  &:focus-visible {
    outline: 0px;
  }

  ${(p: { isSelected: boolean; disabled: boolean; theme: BluJayTheme }): string => {
    if (p.disabled) {
      return `
        background: ${p.theme.backgroundContrast};
        border: ${p.theme.backgroundContrast} 2px solid;
        cursor: not-allowed;

        &:hover {
          border: ${p.theme.backgroundContrast} 2px solid;
        }

        color: ${p.theme.textContrast};
      `;
    } else {
      return `
        background: ${p.isSelected ? p.theme.highlightLight : p.theme.button};
        border: ${p.isSelected ? p.theme.highlightLight : p.theme.button} 2px solid;
        cursor: pointer;

        &:hover {
          border: ${p.isSelected ? p.theme.hightlightSilver : p.theme.highlightLight} 2px solid;
        }
      `;
    }
  }};
`;

const Text = styled.h6`
  width: ${(p: { maxLength: number }): number => p.maxLength}ch;
`;

const Icon = styled.i`
  margin: auto;
  margin-top: 1px;
  padding-right: 1px;
  font-size: 1.1em !important;
`;

const IconWithText = styled(Icon)`
  padding-right: 5px;
  margin-left: 5px;
`;

const Wrapper = styled.div`
  width: 0px;
  height: 0px;
  position: relative;
  display: grid;
  justify-self: ${(p: { isOffscreen: OffScreenType }): string => (p.isOffscreen ? p.isOffscreen : "center")};
  z-index: 2;
`;

const FlexBox = styled.div`
  text-align: center;
  display: flex;
`;

const Box = styled.div`
  animation: fadein 0.5s;
  position: fixed;
  white-space: nowrap;
  margin-top: 19px;
  background: ${(p): string => p.theme.button};
  padding: 10px;
  border-radius: 8px;
  justify-self: ${(p: { isOffscreen: OffScreenType }): string => (p.isOffscreen ? p.isOffscreen : "center")};

  @media (max-width: ${screenSizes.mobileScreenSize}px) {
    display: none;
  }
`;

const SelectedBox = styled(Box)`
  @keyframes fadeInOut {
    0% {
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  animation: fadeInOut 0.75s linear 1 forwards;
`;

type OffScreenType = "right" | "left" | undefined;

interface ButtonIconProps {
  icon?: string;
  selectedIcon?: string;
  textOn?: string;
  textOff?: string;
  isSelected?: boolean;
  hoverTextOn?: string;
  hoverTextOff?: string;
  confrimTextOn?: string;
  confrimTextOff?: string;
  className?: string;
  disabled?: boolean;
  onClick?: (e: MouseEvent) => void;
}

const ButtonIcon: FC<ButtonIconProps> = ({
  icon,
  textOn,
  textOff,
  isSelected,
  selectedIcon,
  hoverTextOn,
  hoverTextOff,
  confrimTextOn,
  confrimTextOff,
  className,
  disabled,
  onClick,
}) => {
  const [isHover, setIsHover] = useState(false);
  const [isOffscreen, setIsOffscreen] = useState<OffScreenType>();
  const [isPlaying, setIsPlaying] = useState(false);
  const hoverEl = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (): void => {
    setIsHover(true);
  };

  const handleMouseLeave = (): void => {
    setIsHover(false);
  };

  const isElOffscreen = (): OffScreenType => {
    if (hoverEl?.current) {
      const rect = hoverEl.current.getBoundingClientRect();

      if (rect.x + rect.width >= window.innerWidth) {
        return "right";
      }

      if (rect.x <= 0) {
        return "left";
      }
    }
  };

  const handleClick = (e: MouseEvent): void => {
    if (confrimTextOn || confrimTextOff) {
      setIsPlaying(false);
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
      }, 750);
    }
    if (onClick) onClick(e);
  };

  const onHoverOverSelectedBox = (): void => {
    setIsPlaying(false);
    setIsHover(false);
  };

  const _icon = isSelected ? selectedIcon : icon;
  let confirmText = confrimTextOn || confrimTextOff;
  let hoverText = hoverTextOn || hoverTextOff;
  let _text = textOn || textOff;

  if (!isSelected && confrimTextOff) confirmText = confrimTextOff;
  if (!isSelected && hoverTextOff) hoverText = hoverTextOff;
  if (!isSelected && textOff) _text = textOff;

  const maxLength = Math.max(textOn?.length || 0, textOff?.length || 0);

  useEffect((): void => {
    setIsOffscreen(isElOffscreen());
  }, [isHover]);

  return (
    <ButtonWrapper>
      <Button
        onClick={handleClick}
        isSelected={isSelected || false}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={className}
        disabled={!!disabled}
        tabIndex={0}
      >
        <>
          {_text ? (
            <>
              <FlexBox>
                {icon && <IconWithText className={_icon} />}
                <Text maxLength={maxLength}>{_text}</Text>
              </FlexBox>
            </>
          ) : (
            <>{icon && <Icon className={_icon} />}</>
          )}
          {hoverText && !isPlaying && isHover && (
            <Wrapper isOffscreen={isOffscreen}>
              <Box isOffscreen={isOffscreen} ref={hoverEl}>
                {hoverText}
              </Box>
            </Wrapper>
          )}
          {confirmText && isPlaying && (
            <Wrapper isOffscreen={isOffscreen}>
              <SelectedBox isOffscreen={isOffscreen} onMouseOver={onHoverOverSelectedBox}>
                {confirmText}
              </SelectedBox>
            </Wrapper>
          )}
        </>
      </Button>
    </ButtonWrapper>
  );
};

export default ButtonIcon;
