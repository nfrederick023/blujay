"use client";
import { CookieTypes } from "@client/utils/types";
import { Cookies, CookiesProvider } from "react-cookie";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "@client/utils/theme";
import { getCookieDefault, getCookieSetOptions } from "@client/utils/cookie";
import React, { FC, ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

const allCookieTypes: CookieTypes[] = [
  "authToken",
  "isDarkMode",
  "theaterMode",
  "videoVolume",
];

const Providers: FC<ProvidersProps> = ({ children }) => {
  const cookies = new Cookies();
  allCookieTypes.forEach((cookieType) => {
    if (!cookies.get(cookieType))
      cookies.set(
        cookieType,
        getCookieDefault(cookieType),
        getCookieSetOptions()
      );
  });

  const theme = cookies.get("isDarkMode") === "true" ? darkTheme : lightTheme;

  return (
    <CookiesProvider cookies={cookies}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CookiesProvider>
  );
};

export default Providers;
