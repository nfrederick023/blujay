import { useRouter } from "next/router";
import ButtonIcon from "../button";
import React, { FC } from "react";

const BackButton: FC = () => {
  const router = useRouter();
  const goBack = (): void => {
    router.back();
  };

  return <ButtonIcon icon="bx-arrow-back" text="Go Back" isCondensed="condensed" onClick={goBack} />;
};

export default BackButton;
