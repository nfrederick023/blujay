import { RouterEvent, useRouter } from "next/router";
import React, { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const loadDurationMS = 1000;
const intialPercentage = 80;

const BlueBar = styled.div`
  position: fixed;
  width: 0%;
  height: 2px;
  background-color: ${(p): string => p.theme.highlightLight};
  border-radius: 5px;
  z-index: 5;
`;

const LoadBar: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const endTansitionTime = loadDurationMS * (100 - intialPercentage) * 0.01;
  const startTansitionTime = loadDurationMS * intialPercentage * 0.01;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!firstRender.current) {
    if (!isLoading && ref.current?.getAttribute("style") !== "") {
      ref.current?.setAttribute("style", "transition: 100ms; width: 100%;");
      setTimeout(() => {
        ref.current?.setAttribute("style", "");
      }, endTansitionTime);
    }

    if (isLoading) {
      ref.current?.setAttribute("style", `transition: ${startTansitionTime}ms; width: ${intialPercentage}%;`);

      setTimeout(() => {
        if (ref.current?.style.width !== "" && ref.current?.style.width !== "100%")
          ref.current?.setAttribute("style", `transition: ${loadDurationMS * 5}ms; width: 90%;`);
      }, startTansitionTime);
    }
  }

  useEffect(() => {
    firstRender.current = false;

    const enableLoadbar = (url: string, { shallow }: { shallow: boolean }): void => {
      if (!shallow) {
        setIsLoading(true);
      }
    };

    const disableLoadbar = (url: string, { shallow }: { shallow: boolean }): void => {
      if (!shallow) {
        setIsLoading(false);
      }
    };

    router.events.on("routeChangeStart", enableLoadbar);
    router.events.on("routeChangeComplete", disableLoadbar);

    return () => {
      router.events.off("routeChangeStart", enableLoadbar);
      router.events.off("routeChangeComplete", disableLoadbar);
    };
  }, []);

  return (
    <>
      <BlueBar ref={ref} />
    </>
  );
};

export default LoadBar;
