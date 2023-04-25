import { StyledComponentsRegistry } from "./registry";
import Layout from "@client/components/Common/Layout/Layout";
import Providers from "./providers";
import React, { FC, ReactNode } from "react";
import styled, { createGlobalStyle } from "styled-components";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html>
      <head></head>
      <body>
        <StyledComponentsRegistry>
          <Layout>{children}</Layout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};

export default RootLayout;
