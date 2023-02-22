import React, { FC, useRef } from "react";
import styled from "styled-components";
import theme from "@client/utils/themes";

const SearchBarWrapper = styled.div`
  border-radius: 18px;
  border: 1px solid ${theme.textContrast};
  color: ${theme.textContrast};
  text-align: center;

  display: flex;
  max-width: 49rem;
  min-height: 1.3rem;

  margin: auto;
  margin-top: 15px;
  padding: 5px;

  &:hover {
    cursor: text;
  }

  @media (max-width: ${theme.tabletScreenSize}px) {
    margin-left: 60px;
    margin-right: 15px;
  }
`;

const SearchBarInput = styled.input`
  border: 0px;
  margin: 1px 0px 0px 4px;
  color: ${theme.textContrast};
  background-color: rgba(0, 0, 0, 0);
  &:focus {
    outline: none;
  }
`;

const SearchIcon = styled.i`
  margin-left: 10px;
`;

const SearchBar: FC = () => {
  const searchInput = useRef<HTMLInputElement>(null);

  const handleSearchClick = (): void => {
    searchInput.current?.focus();
  };

  return (
    <SearchBarWrapper onClick={handleSearchClick}>
      <SearchIcon className="fa fa-magnifying-glass" />
      <SearchBarInput
        ref={searchInput}
        id="default-search"
        placeholder="Search"
        autoComplete="off"
        required
      />
    </SearchBarWrapper>
  );
};

export default SearchBar;
