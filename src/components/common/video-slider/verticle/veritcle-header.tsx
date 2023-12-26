import { OrderType, SortType, ViewType } from "@client/utils/types";
import { screenSizes, sortOptions } from "@client/utils/constants";
import React, { FC } from "react";
import Select from "../../shared/select";
import SliderHeader from "../header";
import ToggleIcon from "../../shared/toggle-icon";
import styled from "styled-components";

const SortSelect = styled.div`
  margin-right: 15px;
  display: flex;
  width: 290px;
  min-width: 290px;
  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    margin-top: 10px;
  }
`;

const TypeSelect = styled.div`
  width: 110px;
  min-width: 110px;
  display: flex;

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    margin-top: 10px;
  }
`;

const viewOptions: ViewType[] = ["Grid View", "List View"];

interface VeticleSliderHeaderProps {
  handleSortChange: (sort: string) => void;
  handleIsAscendingChange: () => void;
  handleViewChange: (view: string) => void;
  headerText: string;
  order: OrderType;
  sort: SortType;
  view: ViewType;
}

const VeticleSliderHeader: FC<VeticleSliderHeaderProps> = ({
  handleIsAscendingChange,
  handleViewChange,
  handleSortChange,
  headerText,
  order,
  sort,
  view,
}) => {
  return (
    <>
      <SliderHeader headerText={headerText} sliderType="verticle">
        <SortSelect>
          <ToggleIcon
            onClick={handleIsAscendingChange}
            isToggled={order === "Ascending"}
            onIcon="bx bx-sort-up"
            offIcon="bx bx-sort-down"
          />
          <Select options={[...sortOptions]} onChange={handleSortChange} value={[sort]} postFix={" " + order} />
        </SortSelect>
        <TypeSelect>
          <Select options={viewOptions} onChange={handleViewChange} value={[view]} />
        </TypeSelect>
      </SliderHeader>
    </>
  );
};

export default VeticleSliderHeader;
