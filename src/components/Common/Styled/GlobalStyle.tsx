import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
html {
  font-family: 'Montserrat';
  background-color: ${(p): string => p.theme.background};
  color: ${(p): string => p.theme.text};
}

// prevents content shift on scrollbar
body {
  width: calc(100vw - 15px);
}

html, body {
  margin: 0px;
}

h1, h2, h3, h4, h5, h6 {
  display: inline;
  margin: 0px;
}

h1 {
  line-height: 75%;
  font-size: 1.9em;
  font-weight: 900;
}

h2 {
  font-size: 1.7em;
  font-weight: 700;
}

h5{
  font-size: 1em;
  font-weight: 500;
}

h6{
  font-size: 0.83em;
  font-weight: 500;
}

input, textarea, select { 
  font-family:inherit; 
  font-size: inherit; 
}
`;

export default GlobalStyle;
