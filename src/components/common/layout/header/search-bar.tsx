import { debounce } from "lodash";
import { screenSizes } from "@client/utils/constants";
import React, { ChangeEvent, Dispatch, FC, SetStateAction, useRef } from "react";
import styled from "styled-components";

const SearchBarContent = styled.div`
  border: 1px solid ${(p): string => p.theme.textContrast};
  color: ${(p): string => p.theme.textContrast};
  border-radius: 18px;
  text-align: center;
  display: flex;
  min-height: 1.3rem;
  max-width: 750px;
  width: 100%;
  margin: auto;
  margin-bottom: 15px;
  margin-top: 13px;
  padding: 4px;

  &:hover {
    cursor: text;
  }

  @media (max-width: ${screenSizes.smallScreenSize}px) {
    margin-left: 70px;
    margin-right: 115px;
    max-width: 100%;
  }

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    margin-left: 70px;
    margin-right: 20px;
  }
`;

const SearchBarInput = styled.input`
  border: 0px;
  color: ${(p): string => p.theme.textContrast};
  background-color: rgba(0, 0, 0, 0);
  vertical-align: bottom;
  width: 100%;
  &:focus {
    outline: none;
  }
`;

const SearchIcon = styled.i`
  font-size: 1.1rem !important;
  margin-left: 5px;
  padding-top: 2px;

  &::before {
    vertical-align: top;
  }
`;

interface SearchBarProps {
  setSearch: Dispatch<SetStateAction<string>>;
}

const SearchBar: FC<SearchBarProps> = ({ setSearch }: SearchBarProps) => {
  const searchInput = useRef<HTMLInputElement>(null);

  const handleSearchClick = (): void => {
    searchInput.current?.focus();
  };

  const debounced = debounce((value) => {
    setSearch(value);
  }, 500);

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>): void => {
    debounced(e.currentTarget.value);
  };

  return (
    <SearchBarContent onClick={handleSearchClick}>
      <SearchIcon className="bx bx-search" />
      <SearchBarInput
        ref={searchInput}
        id="default-search"
        placeholder="Search"
        autoComplete="off"
        onInput={handleSearchInput}
      />
    </SearchBarContent>
  );
};

export default SearchBar;
