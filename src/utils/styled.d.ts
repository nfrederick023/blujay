import "styled-components";
import { BluJayTheme } from "@client/utils/types";

type CustomTheme = typeof theme;

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends BluJayTheme { }
}