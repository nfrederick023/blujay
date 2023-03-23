import { useRouter } from "next/router";
import React, { FC } from "react";
import styled from "styled-components";
import theme from "@client/utils/themes";

const CategoryButtonWrapper = styled.div`
  padding: 7px;
  padding-left: 25px;

  div {
    display: inline-block;
    position: relative;

    ::after {
      content: "";
      position: absolute;
      width: 100%;
      transform: scaleX(0);
      height: 1px;
      bottom: 0;
      left: 0;
      background-color: ${theme.textContrast};
      transform-origin: bottom right;
      transition: transform 0.25s ease-out;
    }
  }

  &:hover {
    div {
      color: ${theme.text};
      ::after {
        transform: scaleX(1);
        transform-origin: bottom left;
      }
    }
    cursor: pointer;
  }
`;

const CategoryButtonName = styled.div``;

const SelectedCategory = styled.div`
  color: ${theme.text};
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
