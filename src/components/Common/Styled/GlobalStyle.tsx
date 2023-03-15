import { createGlobalStyle } from "styled-components";
import theme from "@client/utils/themes";

const GlobalStyle = createGlobalStyle`
html {
  font-family: 'Montserrat';
  background-color: ${theme.background};
  color: ${theme.text};
}

// hide scrollbar on 100vh
* {
    box-sizing: border-box;
}

// hide scrollbar on 100vh
html, body {
  margin: 0px;
  padding: 0px;
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

.sidebar-button {
    background: linear-gradient(to top right, #4481eb, #04befe);
    border: none;
    border-radius: 10px;
    color: white;
    font-family: 'Montserrat SemiBold', sans-serif;
    text-align: left;
    height: 45px;
    width: 200px;
    padding-left: 30px;
    font-size: large;
}

// global position fix for FontAwesome icons 
.bx::before {
  vertical-align: middle;
}
`;

export default GlobalStyle;
