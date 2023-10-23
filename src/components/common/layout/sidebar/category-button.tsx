import { booleanify, getCookieSetOptions } from "@client/utils/cookie";
import { screenSizes } from "@client/utils/theme";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useWindowWidth } from "@react-hook/window-size";
import Link from "next/link";
import React, { FC, useEffect } from "react";
import styled from "styled-components";

const CategoryButtonWrapper = styled.div`
  color: ${(p): string => p.theme.textContrast};
  padding: 7px;
  padding-left: 22px;

  div {
    transition: 0.1s;
  }

  &:hover {
    div {
      color: ${(p): string => p.theme.text};
    }
    cursor: pointer;
  }
`;

const CategoryButtonName = styled.div``;

const SelectedCategory = styled.div`
  color: ${(p): string => p.theme.text};
`;

interface CategoryButtonProps {
  category: string;
}

const CategoryButton: FC<CategoryButtonProps> = ({ category }: CategoryButtonProps) => {
  const categoryURL = ("/library/" + encodeURIComponent(category)).toLowerCase();
  const [, setCookie] = useCookies();
  const width = useWindowWidth();

  const location = useRouter();
  useEffect(() => {
    if (width < screenSizes.tabletScreenSize) {
      setCookie("isSidebarEnabled", "true", getCookieSetOptions());
    }
  }, [location]);

  const isSelected = categoryURL === window.location.pathname.toLowerCase();
  return (
    <Link href={categoryURL}>
      <CategoryButtonWrapper>
        <CategoryButtonName>
          {isSelected ? <SelectedCategory>{category}</SelectedCategory> : <div>{category}</div>}
        </CategoryButtonName>
      </CategoryButtonWrapper>
    </Link>
  );
};

export default CategoryButton;
