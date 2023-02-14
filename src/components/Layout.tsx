import { FC, ReactNode } from "react";

import { Helmet } from "react-helmet";
import { booleanify } from "../utils/utils";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Container from "./Container";
import React from "react";
import Toggle from "react-toggle";
import getConfig from "next/config";
import styled from "styled-components";

const { publicRuntimeConfig } = getConfig();

const Header = styled.header`
  background-size: 1920px auto;
  background-position: center center;
  background-repeat: no-repeat;
`;

const NavbarContainer = styled(Container)`
  min-height: 3.25rem;
  display: flex;
  align-items: center;
  width: 100%;
`;

const NavbarMenu = styled.div`
  flex: 1;
  display: flex;
  justify-content: end;
`;

const ApplicationDiv = styled.div`
  padding: 50px 0;
  position: static;

  @media (max-width: 1344px) {
    padding: 20px 0;
  }
`;

const Footer = styled.footer`
  position: absolute;
  right: 0px;
  bottom: 0px;
  left: 0px;
  height: 33px;

  display: flex;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.07);
  color: rgba(0, 0, 0, 0.7);
  text-align: center;
  font-size: 0.8rem;

  i {
    position: relative;
    top: 1px;
    font-size: 1rem;
    margin-right: 2px;
  }

  a,
  a:hover,
  a:visited {
    padding: 6px;
    color: rgba(0, 0, 0, 0.75);
  }

  .dot {
    margin: 0px 4px;
  }
`;

const HeaderTitle = styled.h1`
  font-weight: 800;
  font-size: 1.5rem;
`;

interface LayoutProps {
  children?: ReactNode,
  hasAuth: boolean
}

const Layout: FC<LayoutProps> = ({ children, hasAuth }) => {
  const router = useRouter();
  const [cookies, setCookies] = useCookies(["isDarkMode", "authToken"]);

  const onSignOut = (): void => {
    setCookies("authToken", "", { path: "/", sameSite: "strict", maxAge: 31536000, expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) });
    router.push("/login");
  };

  const onLogIn = (): void => {
    router.push("/login");
  };

  const onHeaderClick = (): void => {
    router.push("/");
  };

  const toggleDarkMode = (): void => {
    setCookies("isDarkMode", !booleanify(cookies.isDarkMode), { path: "/", sameSite: "strict", maxAge: 31536000, expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) });
  };

  if (!hasAuth && cookies.authToken) {
    setCookies("authToken", "", { path: "/", sameSite: "strict", maxAge: 31536000, expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) });
  }

  return (
    <>
      {booleanify(cookies.isDarkMode) ? (
        <Helmet>
          <link rel="stylesheet"
            href="https://unpkg.com/bulma-dark-variant@0.1.2/css/bulma-prefers-dark.css"
            integrity=
            "sha384-+O4suC4e+wPpI+J/CjVVRBa0Ucczt7woYuvUIGGns36h/5cvowumaIQMDZBbu0Tz"
            crossOrigin="anonymous"
          />
        </Helmet>
      ) : (
        <Helmet></Helmet>
      )}
      <section className="hero is-dark">
        <Header className="hero-head">
          <nav>
            <NavbarContainer>
              <a onClick={onHeaderClick}>
                <HeaderTitle className="title is-4">
                  {publicRuntimeConfig.pageTitle}
                </HeaderTitle>
              </a>
              <NavbarMenu>
                <Toggle
                  icons={false}
                  checked={booleanify(cookies.isDarkMode)}
                  onChange={toggleDarkMode} />
                {hasAuth && (
                  <>
                    {
                      cookies.authToken ? (
                        <a onClick={onSignOut}>
                          Log out
                        </a>
                      ) : <a onClick={onLogIn}>
                        Log in
                      </a>
                    }
                  </>
                )}
              </NavbarMenu>
            </NavbarContainer>
          </nav>
        </Header>
      </section>

      <ApplicationDiv>
        {children}
      </ApplicationDiv>

      <Footer>
        <div className="container">
          Snacks
        </div>
      </Footer>
    </>
  );
};

export default Layout;
