import { OrderType, SortType, ViewType } from "@client/utils/types";
import React, { FC } from "react";
import Select from "../../shared/select";
import SliderHeader from "../header";
import styled from "styled-components";

const SortIcon = styled.i`
  color: ${(p): string => p.theme.textContrast};
  font-size: 1.25rem;
  vertical-align: baseline;
  margin-left: auto;
  margin-right: 5px;

  &:hover {
    color: ${(p): string => p.theme.text};
    cursor: pointer;
  }
`;

const SortSelect = styled.div`
  display: flex;
  width: 260px;
`;

const TypeSelect = styled.div`
  width: 130px;
  margin-left: 10px;
  display: flex;
`;

const viewOptions: ViewType[] = ["Grid View", "List View"];
const sortOptions: SortType[] = [
  "Alphabetical",
  "Date Created",
  "Date Updated",
  "File Size",
  "View Count",
];

interface VeticleSliderHeaderProps {
  handleSortChange: (sort: string) => void;
  handleIsAscendingChange: () => void;
  handleViewChange: (view: string) => void;
  handleToggleViewChange: () => void;
  headerText: string;
  order: OrderType;
  sort: SortType;
  view: ViewType;
}

const VeticleSliderHeader: FC<VeticleSliderHeaderProps> = ({
  handleIsAscendingChange,
  handleViewChange,
  handleSortChange,
  handleToggleViewChange,
  headerText,
  order,
  sort,
  view,
}: VeticleSliderHeaderProps) => {
  return (
    <>
      <SliderHeader headerText={headerText}>
        <SortSelect>
          <SortIcon
            onClick={handleIsAscendingChange}
            className={
              order === "Ascending" ? "bx bx-sort-up" : "bx bx-sort-down"
            }
          />
          <Select
            options={sortOptions}
            onChange={handleSortChange}
            value={[sort + " " + order]}
          />
        </SortSelect>
        <TypeSelect>
          <SortIcon
            onClick={handleToggleViewChange}
            className={view ? "bx bx-grid-small" : "bx bx-list-ul"}
          />
          <Select
            options={viewOptions}
            onChange={handleViewChange}
            value={[view]}
          />
        </TypeSelect>
      </SliderHeader>
    </>
  );
};

export default VeticleSliderHeader;
