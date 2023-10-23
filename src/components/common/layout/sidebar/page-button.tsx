import { booleanify, getCookieSetOptions } from "@client/utils/cookie";
import { screenSizes } from "@client/utils/theme";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useWindowWidth } from "@react-hook/window-size";
import Gradient from "../../shared/gradient";
import Link from "next/link";
import React, { FC, useEffect } from "react";
import styled from "styled-components";

const ButtonWrapper = styled.div`
  width: 100%;
  color: white;
  margin-right: 40px;
  margin-bottom: 5px;
  line-height: 5px;
  transition: 0.1s;

  span {
    min-height: 40px;
    max-height: 40px;
    border-radius: 10px;
    align-items: center;
    display: flex;
    padding-left: 8px;
    height: inherit;
  }
`;

const Icon = styled.i`
  padding-right: 10px;
`;

const Unselected = styled.span`
  color: ${(p): string => p.theme.textContrast};

  &:hover {
    color: ${(p): string => p.theme.text};
    cursor: pointer;
  }
`;

interface SideBarButtonProps {
  title: string;
  icon: string;
  url: string;
}

const SideBarButton: FC<SideBarButtonProps> = ({ title, icon, url }: SideBarButtonProps) => {
  const isSelected = window.location.pathname.split("/")[1] === url;
  const [, setCookie] = useCookies();
  const width = useWindowWidth();
  const location = useRouter();

  useEffect(() => {
    if (width < screenSizes.tabletScreenSize) {
      setCookie("isSidebarEnabled", "true", getCookieSetOptions());
    }
  }, [location]);

  return (
    <>
      <ButtonWrapper>
        <Link href={"/" + url}>
          {isSelected ? (
            <Gradient type="background">
              <Icon className={icon} />
              {title}
            </Gradient>
          ) : (
            <Unselected>
              <Icon className={icon} />
              {title}
            </Unselected>
          )}
        </Link>
      </ButtonWrapper>
    </>
  );
};

export default SideBarButton;
