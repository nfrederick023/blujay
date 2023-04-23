import { screenSizes } from "@client/utils/themes";
import React, { FC, useRef } from "react";
import styled from "styled-components";

const SearchBarContent = styled.div`
  border: 1px solid ${(p): string => p.theme.textContrast};
  color: ${(p): string => p.theme.textContrast};
  border-radius: 18px;
  text-align: center;
  display: flex;
  min-height: 1.3rem;
  max-width: 35rem;
  margin: auto;
  margin-bottom: 15px;
  margin-top: 13px;
  padding: 5px;

  &:hover {
    cursor: text;
  }

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    max-width: 100%;
    margin-left: 65px;
    margin-right: 20px;
  }
`;

const SearchBarInput = styled.input`
  border: 0px;
  color: ${(p): string => p.theme.textContrast};
  background-color: rgba(0, 0, 0, 0);
  vertical-align: bottom;
  &:focus {
    outline: none;
  }
`;

const SearchIcon = styled.i`
  font-size: 1.1rem !important;
  margin-left: 5px;
  padding-top: 3.5px;

  &::before {
    vertical-align: top;
  }
`;

const SearchBar: FC = () => {
  const searchInput = useRef<HTMLInputElement>(null);

  const handleSearchClick = (): void => {
    searchInput.current?.focus();
  };

  return (
    <SearchBarContent onClick={handleSearchClick}>
      <SearchIcon className="bx bx-search" />
      <SearchBarInput
        ref={searchInput}
        id="default-search"
        placeholder="Search"
        autoComplete="off"
      />
    </SearchBarContent>
  );
};

export default SearchBar;
