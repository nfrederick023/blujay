import React, { FC } from "react";
import styled from "styled-components";

const BackToTopButton = styled.div`
  position: fixed;
`;

const BackToTop: FC = () => {
  return (
    <>
      <BackToTopButton>Back to Top</BackToTopButton>
    </>
  );
};

export default BackToTop;
