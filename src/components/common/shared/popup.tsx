import { screenSizes } from "@client/utils/constants";
import { useCookies } from "react-cookie";
import React, { FC, ReactNode } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
  cursor: pointer;
`;

const PopupWrapper = styled.div`
  z-index: 6;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: fill-available;
  height: fill-available;
  pointer-events: none;

  @media (min-width: ${screenSizes.smallScreenSize}px) {
    left: ${(p: { isSidebarEnabled: boolean }): string => (p.isSidebarEnabled ? "250px" : "0px")};
  }
`;

const PopupBox = styled.div`
  pointer-events: auto;
  margin: auto;
  flex-wrap: wrap;
  align-content: baseline;
  background-color: ${(p): string => p.theme.backgroundContrast};
  border-radius: 10px;
  padding: 20px;

  &::-webkit-scrollbar {
    width: 1px;
    background-color: rgba(0, 0, 0, 0);
  }
`;

const CloseWrapper = styled.div`
  width: 100%;
  margin-bottom: 10px;
  display: flex;
`;

const Icon = styled.i`
  color: ${(p): string => p.theme.textContrast};
  font-size: 28px;
  margin-left: auto;

  &:hover {
    color: ${(p): string => p.theme.text};
    cursor: pointer;
  }
`;

interface PopupProps {
  children: ReactNode;
  closePopup: () => void;
}

const Popup: FC<PopupProps> = ({ children, closePopup }) => {
  const [cookies] = useCookies(["isSidebarEnabled"]);
  const isSidebarEnabled = cookies.isSidebarEnabled === "true";

  return (
    <>
      <Overlay onClick={closePopup} />
      <PopupWrapper isSidebarEnabled={isSidebarEnabled}>
        <PopupBox>
          <CloseWrapper>
            <Icon onClick={closePopup} className="bx bx-x" />
          </CloseWrapper>
          {children}
        </PopupBox>
      </PopupWrapper>
    </>
  );
};

export default Popup;
