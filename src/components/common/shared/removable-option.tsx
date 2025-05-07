import { TextSmall } from "./text-size";
import React, { FC } from "react";
import styled from "styled-components";

const OptionWrapper = styled.div`
  border-radius: 5px;
  border: 1px solid ${(p): string => p.theme.textContrast};
  display: flex;
  height: 32px;
  padding: 5px;
  margin: 5px;
  width: fit-content;
  overflow: hidden;
`;

const RemoveWrapper = styled.div`
  color: ${(p): string => p.theme.text};
  cursor: pointer;
  border-left: 1px solid ${(p): string => p.theme.text};
  padding-left: 5px;
  margin-left: 10px;
`;

const RemoveIcon = styled.i`
  margin-top: -1px;
  height: 24px;
`;

const OptionText = styled(TextSmall)`
  color: ${(p): string => p.theme.text};
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface RemovableOptionProps {
  onRemove: (...args: unknown[]) => void;
  optionText: string;
}

const RemovableOption: FC<RemovableOptionProps> = ({ onRemove, optionText }) => {
  return (
    <OptionWrapper>
      <OptionText>{optionText}</OptionText>
      <RemoveWrapper onClick={onRemove}>
        <RemoveIcon className="bx-x bx-sm" tabIndex={0} />
      </RemoveWrapper>
    </OptionWrapper>
  );
};

export default RemovableOption;
