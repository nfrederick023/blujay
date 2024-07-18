import React, { FC } from "react";
import styled from "styled-components";

const OptionWrapper = styled.div`
  border-radius: 5px;
  border: 1px solid ${(p): string => p.theme.textContrast};
  display: flex;
  height: 32px;
  padding: 5px;
  margin: 5px;
  max-width: 80%;
`;

const ChevronWrapper = styled.div`
  color: ${(p): string => p.theme.text};
  cursor: pointer;
  border-left: 1px solid ${(p): string => p.theme.text};
  padding-left: 5px;
  margin-left: 10px;
`;

const ChevronIcon = styled.i`
  margin-top: -1px;
`;
const OptionText = styled.h6`
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface RemovableOptionProps {
  onRemove: () => void;
  optionText: string;
}

const RemovableOption: FC<RemovableOptionProps> = ({ onRemove, optionText }) => {
  return (
    <OptionWrapper>
      <OptionText>{optionText}</OptionText>
      <ChevronWrapper onClick={onRemove}>
        <ChevronIcon className="bx bx-x bx-sm" />
      </ChevronWrapper>
    </OptionWrapper>
  );
};

export default RemovableOption;
