import ButtonIcon from "../button";
import React, { FC, MouseEvent } from "react";

interface NavButtonProps {
  isDisabled: boolean;
  onClick: (e: MouseEvent) => void;
  type?: "previous" | "next";
}

const NavButton: FC<NavButtonProps> = (props) => {
  return (
    <ButtonIcon
      icon={props.type === "previous" ? "bx-chevron-left" : "bx-chevron-right"}
      text={props.type === "previous" ? "Previous" : "Next"}
      onClick={props.onClick}
      isDisabled={props.isDisabled}
      isCondensed="condensed"
    />
  );
};

export default NavButton;
