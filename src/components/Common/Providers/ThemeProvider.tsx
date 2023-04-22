import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "@client/utils/themes";
import Cookies from "js-cookie";
import React, { FC } from "react";

interface ThemeProviderProps {
  children?: React.ReactNode;
}

const BluJayThemeProvider: FC<ThemeProviderProps> = ({
  children,
}: ThemeProviderProps) => {
  const theme = Cookies.get("isDarkMode") === "true" ? darkTheme : lightTheme;
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const body = <ThemeProvider theme={theme}>{children}</ThemeProvider>;

  // prevents ssr flash for mismatched dark mode
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{body}</div>;
  }

  return body;
};

export default BluJayThemeProvider;
