import { FC } from "react";
import React from "react";
import styled from "styled-components";

const CenterDiv = styled.div`
   margin: auto;
   width: fit-content;
`;

const NotFound: FC = () => {
  return (
    <CenterDiv>404 - Video Not Found </CenterDiv>
  );
};


export default NotFound;