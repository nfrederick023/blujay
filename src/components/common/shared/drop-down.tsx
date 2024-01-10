import { BluJayTheme, DropDownColor, DropDownOption } from "@client/utils/types";
import React, { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const DropDownWrapper = styled.div`
  position: absolute;

  ${(p: { isVisible: boolean }): string => {
    if (!p.isVisible) {
      return "overflow: hidden";
    }
    return "";
  }}
`;

const DropDownPositioning = styled.div`
  position: relative;
  top: ${(p: { DropDownTop: number; DropDownLeft: number }): number => p.DropDownTop}px;
  left: ${(p: { DropDownTop: number; DropDownLeft: number }): number => p.DropDownLeft}px;
`;

const DropDownBox = styled.div`
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
    isRightOffscreen: boolean;
    DropDownTop: number;
    DropDownLeft: number;
    relativePosition?: RelativePosition;
  }): string => p.theme.backgroundContrast};
  z-index: 2;
  user-select: none;
  ::-webkit-scrollbar {
    display: none;
  }

  @media screen and (max-height: 150px) {
    max-height: 10px;
  }

  ${(p): string => {
    let transform = "";
    if (p.isRightOffscreen || p.relativePosition === "left") {
      transform += " translateX(-100%)";
    }

    if (p.isRightOffscreen) {
      transform += ` translateX(-${p.DropDownLeft + 10}px)`;
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
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropDown: FC<DropDownProps> = ({ options, isShown, top, left, relativePosition, setIsShown }) => {
  const dropDownRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<HTMLDivElement>(null);
  const [isBottomOffscreen, setIsBottomOffscreen] = useState(false);
  const [isRightOffscreen, setIsRightOffscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const onBlur = (): void => {
    setIsShown(false);
  };

  useEffect(() => {
    if (dropDownRef.current && positionRef.current && isShown) {
      dropDownRef.current.focus();
      const pageMargin = 10;

      const dropDownRect = dropDownRef.current.getBoundingClientRect();
      const positionRect = positionRef.current.getBoundingClientRect();
      const bottomY = positionRect.y + dropDownRect.height + top;
      let rightX = positionRect.x + dropDownRect.width + pageMargin + left;

      if (relativePosition === "left") {
        rightX = positionRect.x - dropDownRect.width + pageMargin + left;
      }

      if (bottomY > window.innerHeight) {
        setIsBottomOffscreen(true);
      }

      if (rightX > window.innerWidth) {
        setIsRightOffscreen(true);
      }

      setIsVisible(true);
    } else {
      setIsVisible(false);
      setIsRightOffscreen(false);
      setIsBottomOffscreen(false);
    }
  }, [isShown]);

  return (
    <DropDownWrapper isVisible={isVisible}>
      {isShown ? (
        <DropDownPositioning DropDownTop={top} DropDownLeft={left} ref={positionRef}>
          <DropDownBox
            tabIndex={0}
            onBlur={onBlur}
            ref={dropDownRef}
            isBottomOffscreen={isBottomOffscreen}
            isRightOffscreen={isRightOffscreen}
            DropDownTop={top}
            DropDownLeft={left}
            relativePosition={relativePosition}
          >
            {options.length ? (
              <>
                {options.map((option, i) => {
                  return (
                    <Option key={i} onClick={option.action} color={option.color}>
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
      ) : (
        <></>
      )}
    </DropDownWrapper>
  );
};

export default DropDown;
