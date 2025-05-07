import { OrderType, SortType } from "@client/utils/types";
import { screenSizes, sortOptions } from "@client/utils/constants";
import React, { FC } from "react";
import Select from "@client/components/common/shared/select";
import SliderHeader from "../header";
import ToggleIcon from "@client/components/common/shared/toggle-icon";
import styled from "styled-components";

const SortSelect = styled.div`
  margin-right: 15px;
  display: flex;
  width: 190px;
  min-width: 190px;
  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    margin-top: 10px;
  }
`;

interface VeticleSliderHeaderProps {
  handleSortChange: (sort: string) => void;
  handleIsAscendingChange: () => void;
  headerText: string;
  order: OrderType;
  sort: SortType;
}

const VeticleSliderHeader: FC<VeticleSliderHeaderProps> = (props) => {
  return (
    <>
      <SliderHeader headerText={props.headerText} sliderType="verticle">
        <SortSelect>
          <ToggleIcon
            onClick={props.handleIsAscendingChange}
            isToggled={props.order === "Ascending"}
            onIcon="bx-sort-up"
            offIcon="bx-sort-down"
          />
          <Select options={[...sortOptions]} onChange={props.handleSortChange} value={[props.sort]} />
        </SortSelect>
      </SliderHeader>
    </>
  );
};

export default VeticleSliderHeader;
