import React, { FC, useRef } from "react";
import styled from "styled-components";
import theme from "@client/utils/themes";

const SearchBarContent = styled.div`
  border: 1px solid ${theme.textContrast};
  color: ${theme.textContrast};
  border-radius: 18px;
  text-align: center;
  display: flex;
  min-height: 1.3rem;
  max-width: 35rem;
  margin: auto;
  margin-bottom: 15px;
  margin-top: 15px;
  padding: 5px;

  &:hover {
    cursor: text;
  }

  @media (max-width: ${theme.tabletScreenSize}px) {
    max-width: 100%;
    margin-left: 65px;
    margin-right: 20px;
  }
`;

const SearchBarInput = styled.input`
  border: 0px;
  margin: 1px 0px 0px 2px;
  color: ${theme.textContrast};
  background-color: rgba(0, 0, 0, 0);
  vertical-align: bottom;
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
