import Popup from "@client/components/common/shared/popup";
import React, { FC } from "react";
import styled from "styled-components";

const PopupContent = styled.div`
  height: 500px;
  width: 800px;
`;

interface CategoryPopupProps {
  togglePopup: () => void;
}

const CategoryPopup: FC<CategoryPopupProps> = ({ togglePopup }) => {
  return (
    <Popup closePopup={togglePopup}>
      <PopupContent>test</PopupContent>
    </Popup>
  );
};

export default CategoryPopup;
