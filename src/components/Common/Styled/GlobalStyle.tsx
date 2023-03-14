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

h1 {
  line-height: 75%;
  font-size: 3em;
  font-weight: 900;
  display: inline;
  margin: 0px;
}

h2 {
  font-weight: 700;
  display: inline;
  margin: 0px;
}

h4{
  font-weight: 500;
  display: inline;
  margin: 0px;
}

h5{
  font-weight: 500;
  display: inline;
  margin: 0px;
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

.fa::before {
  line-height: normal;
  vertical-align: middle;
}
`;

export default GlobalStyle;
