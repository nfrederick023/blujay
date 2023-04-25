"use client";
import { debounce } from "lodash";
import { screenSizes } from "@client/utils/theme";
import React, { FC, useRef } from "react";
import router from "next/router";
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
  width: 100%;
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

interface SearchBarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: FC<SearchBarProps> = ({
  search,
  setSearch,
}: SearchBarProps) => {
  const searchInput = useRef<HTMLInputElement>(null);

  const handleSearchClick = (): void => {
    searchInput.current?.focus();
  };

  const debounced = debounce((value) => {
    setSearch(value);
  }, 1000);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.currentTarget.value) debounced(e.currentTarget.value);
    else setSearch("");
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
