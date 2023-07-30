import Link from "next/link";
import React, { FC } from "react";
import router from "next/router";
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
