import { BluJayTheme, ScreenSizes } from "./types";

export const lightTheme: BluJayTheme = {
  background: "#ffffff",
  backgroundContrast: "#f9f9f9",
  text: "black",
  textContrast: "#868686",
  textContrastLight: "#8c8c8c",
  highlightLight: "#3c81eb",
  highlightDark: "#04befe"
};

export const darkTheme: BluJayTheme = {
  background: "#0e0e0f",
  backgroundContrast: "#181819",
  text: "white",
  textContrast: "#868686",
  textContrastLight: "#8c8c8c",
  highlightLight: "#3c81eb",
  highlightDark: "#04befe"
};

export const screenSizes: ScreenSizes = {
  largeScreenSize: 2560,
  mediumScreenSize: 1920,
  smallScreenSize: 1280,
  tabletScreenSize: 720,
  mobileScreenSize: 480,
};