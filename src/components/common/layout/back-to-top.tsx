import { blujayTheme } from "@client/utils/constants";
import React, { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const BackToTopWrapper = styled.div`
  bottom: ${(p: { isProgressBarShown: boolean; isScrolledDown: boolean }): string => {
    if (p.isScrolledDown) {
      if (p.isProgressBarShown) {
        return "90px";
      } else {
        return "20px";
      }
    }
    return "-40px";
  }};
  transition: 0.25s;
  position: fixed;
  width: fill-available;
  pointer-events: none;
  z-index: 2;
  align-items: center;
  display: flex;
  justify-content: center; /* Horizontal center alignment */
  user-select: none;
`;

const BackToTopButton = styled.div`
  width: 150px;
  height: 40px;
  display: flex;
  border-radius: 25px;
  align-items: center;
  justify-content: center; /* Horizontal center alignment */
  background-color: ${blujayTheme.highlightLight};
  padding-bottom: 1px;
  select: none;
  cursor: pointer;
  pointer-events: auto;

  &:hover {
    border: 2px solid ${blujayTheme.text};
  }
`;

interface BackToTopProps {
  isProgressBarShown: boolean;
}

const BackToTop: FC<BackToTopProps> = ({ isProgressBarShown }) => {
  const [isScrolledDown, setIsScrollDown] = useState(false);
  const scrolledDown = useRef(false);
  scrolledDown.current = isScrolledDown;

  const scrollToTop = (e: React.MouseEvent): void => {
    e.preventDefault();
    window.scrollBy({ left: 0, top: -window.scrollY, behavior: "smooth" });
  };

  const onScroll = (): void => {
    const scrollThreshold = 500;
    if (window.scrollY > scrollThreshold && !scrolledDown.current) {
      setIsScrollDown(true);
    }

    if (window.scrollY < scrollThreshold && scrolledDown.current) {
      setIsScrollDown(false);
    }
  };

  useEffect(() => {
    //add eventlistener to window
    window.addEventListener("scroll", onScroll);
    // remove event on unmount to prevent a memory leak with the cleanup
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <BackToTopWrapper isProgressBarShown={isProgressBarShown} isScrolledDown={isScrolledDown}>
      <BackToTopButton onClick={scrollToTop}>
        <h5>Back to Top</h5>
      </BackToTopButton>
    </BackToTopWrapper>
  );
};

export default BackToTop;
