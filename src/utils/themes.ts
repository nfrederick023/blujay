import Cookies from "js-cookie";

interface BluJayColorTheme {
  readonly background: string;
  readonly backgroundContrast: string;
  readonly text: string;
  readonly textContrast: string;
}

interface BluJayGlobalTheme {
  readonly largeScreenSize: number;
  readonly smallScreenSize: number;
  readonly tabletScreenSize: number;
  readonly mobileScreenSize: number;
  readonly highlightLight: string;
  readonly highlightDark: string;
}

type BluJayTheme = BluJayGlobalTheme & BluJayColorTheme

const lightTheme: BluJayColorTheme = {
  background: "white",
  backgroundContrast: "white",
  text: "black",
  textContrast: "#868686"
};

const darkTheme: BluJayColorTheme = {
  background: "#0e0e0f",
  backgroundContrast: "#181819",
  text: "white",
  textContrast: "#868686"
};

const globalTheme: BluJayGlobalTheme = {
  largeScreenSize: 1200,
  smallScreenSize: 1024,
  tabletScreenSize: 768,
  mobileScreenSize: 480,
  highlightLight: "#3c81eb",
  highlightDark: "#04befe"
};

const getTheme = (): BluJayTheme => {
  const isDarkMode = !(typeof window !== "undefined" && Cookies.get("isDarkMode") === "false");

  if (isDarkMode)
    return { ...darkTheme, ...globalTheme };
  return { ...lightTheme, ...globalTheme };

};

const theme = getTheme();

export default theme;