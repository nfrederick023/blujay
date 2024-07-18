import { BluJayTheme, DropDownColor, DropDownOption } from "@client/utils/types";
import React, { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const DropDownWrapper = styled.div`
  position: absolute;
  width: inherit;

  ${(p: { isVisible: boolean }): string => {
    if (!p.isVisible) {
      return "visibility: hidden; overflow: hidden;";
    }
    return "";
  }}
`;

const DropDownPositioning = styled.div`
  position: relative;
  width: inherit;
  top: ${(p: { DropDownTop: number; DropDownLeft: number }): number => p.DropDownTop}px;
  left: ${(p: { DropDownTop: number; DropDownLeft: number }): number => p.DropDownLeft}px;
`;

const DropDownBox = styled.div`
  width: inherit;
  position: absolute;
  padding: 10px 0px 10px 0px;
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  text-wrap: nowrap;
  border-radius: 15px;
  background-color: ${(p: {
    theme: BluJayTheme;
    isBottomOffscreen: boolean;
    DropDownTop: number;
    DropDownLeft: number;
    relativePosition?: RelativePosition;
    hasBorder?: boolean;
  }): string => p.theme.backgroundContrast};
  z-index: 2;
  user-select: none;
  ::-webkit-scrollbar {
    display: none;
  }

  ${(p): string => {
    if (p.hasBorder) {
      return `
        border-radius: 0px;
        border-bottom-right-radius: 15px;
        border-bottom-left-radius: 15px;
        border: 1px solid ${p.theme.textContrast};
        margin-top: 5px;
      `;
    }
    return "";
  }}

  @media screen and (max-height: 150px) {
    max-height: 10px;
  }

  ${(p): string => {
    let transform = "";
    if (p.relativePosition === "left") {
      transform += " translateX(-100%)";
    }
    if (p.isBottomOffscreen) {
      transform += ` translateY(-100%) translateY(-${p.DropDownTop + 10}px)`;
    }
    if (transform) {
      return "transform: " + transform + ";";
    }
    return "";
  }}
`;

const Option = styled.div`
  padding: 8px 30px 8px 15px;
  color: ${(p: { theme: BluJayTheme; color?: DropDownColor }): string =>
    p.color === "red" ? p.theme.error : p.theme.text};
  font-weight: ${(p): string => (p.color === "red" ? "450" : "400")};
  display: flex;

  &:hover {
    color: ${(p): string => p.theme.text};
    background-color: ${(p): string => (p.color === "red" ? p.theme.error : p.theme.highlightLight)};
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

type RelativePosition = "left" | "right";

interface DropDownProps {
  options: DropDownOption[];
  isShown: boolean;
  top: number;
  left: number;
  relativePosition?: RelativePosition;
  hasBorder?: boolean;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropDown: FC<DropDownProps> = ({ options, isShown, top, left, relativePosition, hasBorder, setIsShown }) => {
  const dropDownRef = useRef<HTMLDivElement>(null);
  const [isBottomOffscreen, setIsBottomOffscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const blurOnClick = (
    func: (e: React.MouseEvent<Element, MouseEvent>) => void
  ): ((e: React.MouseEvent<Element, MouseEvent>) => void) => {
    return (e: React.MouseEvent<Element, MouseEvent>): void => {
      setIsShown(false);
      func(e);
    };
  };

  const onBlur = (): void => {
    setIsShown(false);
  };

  useEffect(() => {
    if (dropDownRef.current && isShown) {
      const dropDownRect = dropDownRef.current.getBoundingClientRect();
      const bottomY = dropDownRect.y + dropDownRect.height + top;

      if (bottomY > window.innerHeight) {
        setIsBottomOffscreen(true);
      }

      setIsVisible(true);
    } else {
      setIsVisible(false);
      setIsBottomOffscreen(false);
    }
  }, [isShown]);

  useEffect(() => {
    if (dropDownRef.current) {
      dropDownRef.current.focus();
    }
  }, [isVisible]);

  return (
    <DropDownWrapper isVisible={isVisible && isShown}>
      <DropDownPositioning DropDownTop={top} DropDownLeft={left}>
        <DropDownBox
          tabIndex={0}
          onBlur={onBlur}
          ref={dropDownRef}
          isBottomOffscreen={isBottomOffscreen}
          DropDownTop={top}
          DropDownLeft={left}
          relativePosition={relativePosition}
          hasBorder={hasBorder}
        >
          {options.length ? (
            <>
              {options.map((option, i) => {
                return (
                  <Option key={i} onClick={blurOnClick(option.action)} color={option.color}>
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
      </DropDownPositioning>
    </DropDownWrapper>
  );
};

export default DropDown;
