import { createGlobalStyle } from "styled-components";
import theme from "@client/utils/themes";

const GlobalStyle = createGlobalStyle`
html {
  font-family: 'Montserrat';
  background-color: ${theme.background};
  color: ${theme.text};
}

body {
  margin: 0px;
}

h2 {
  font-weight: bold;
}

.fa::before {
  line-height: normal;
  vertical-align: middle;
}
`;

export default GlobalStyle;
