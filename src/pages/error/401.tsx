import { FC } from "react";
import React from "react";
import styled from "styled-components";

const CenterDiv = styled.div`
   margin: auto;
   width: fit-content;
`;

const NotFound: FC = () => {
  return (
    <CenterDiv>You do not have permission to view this page. </CenterDiv>
  );
};

export default NotFound;