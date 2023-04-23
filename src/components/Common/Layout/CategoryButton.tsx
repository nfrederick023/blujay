import { useRouter } from "next/router";
import React, { FC } from "react";
import styled from "styled-components";

const CategoryButtonWrapper = styled.div`
  padding: 7px;
  padding-left: 25px;

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

const CategoryButton: FC<CategoryButtonProps> = ({
  category,
}: CategoryButtonProps) => {
  const router = useRouter();
  const categoryURL = ("/library/" + category).toLowerCase();
  const navigateToCategory = (): void => {
    router.push(categoryURL);
  };
  const isSelected = categoryURL === window.location.pathname.toLowerCase();
  return (
    <CategoryButtonWrapper onClick={navigateToCategory}>
      <CategoryButtonName>
        {isSelected ? (
          <SelectedCategory>{category}</SelectedCategory>
        ) : (
          <div>{category}</div>
        )}
      </CategoryButtonName>
    </CategoryButtonWrapper>
  );
};

export default CategoryButton;
