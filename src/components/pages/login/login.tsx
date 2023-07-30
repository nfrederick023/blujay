import { getCookieSetOptions } from "@client/utils/cookie";
import { login } from "@client/utils/api";
import { screenSizes } from "@client/utils/theme";
import { useCookies } from "react-cookie";
import ButtonIcon from "@client/components/common/shared/button-icons/button-icon";
import Gradient from "@client/components/common/shared/gradient";
import React, { FC, useState } from "react";
import TextField from "@client/components/common/shared/text-field";
import router from "next/router";
import styled from "styled-components";

const LoginPageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  padding-bottom: 100px;
`;

const LoginPageWrapper = styled.span`
  margin: 20px;
`;

const Logo = styled.div`
  user-select: none;
  text-align: center;
  white-space: nowrap;
`;

const BlujayText = styled.span`
  font-size: 7em;
  font-weight: 900;

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    font-size: 5em;
  }

  @media (max-width: ${screenSizes.mobileScreenSize}px) {
    font-size: 20vw;
  }
`;

const Checkbox = styled.input`
  vertical-align: text-bottom;
  accent-color: ${(p): string => p.theme.highlightLight};
`;

const CheckboxLabel = styled.label`
  color: ${(p): string => p.theme.textContrast};
  user-select: none;
  transtion: 0.2s;
  h6 {
    position: relative;
    bottom: 1px;
  }

  &:hover {
    cursor: pointer;
    color: ${(p): string => p.theme.text};
  }
`;

const FlexBox = styled.div`
  display: flex;
  margin-top: 5px;
`;

const LoginButton = styled.span`
  display: flex;
  margin-left: auto;
`;

const LoginFailedMessage = styled.div`
  min-height: 20px;
`;

const LoginPage: FC = () => {
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies(["authToken"]);
  const [hasLoginFailed, setHasLoginFailed] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const onPasswordChange = (password: string): void => {
    setPassword(password);
  };

  const onIsPasswordShownChange = (): void => {
    setIsPasswordShown(!isPasswordShown);
  };

  const handleLogin = async (): Promise<void> => {
    setHasLoginFailed(false);
    const res = await login(password);
    if (res.ok) {
      setCookie("authToken", await res.text(), getCookieSetOptions());
      router.push("/");
    } else setHasLoginFailed(true);
  };

  return (
    <LoginPageContainer>
      <LoginPageWrapper>
        <Logo>
          <Gradient type="text">
            <BlujayText>BLU</BlujayText>
          </Gradient>
          <Gradient type="text" color="silver">
            <BlujayText>JAY</BlujayText>
          </Gradient>
        </Logo>
        {hasLoginFailed ? <LoginFailedMessage>Login Failed!</LoginFailedMessage> : <LoginFailedMessage />}

        <TextField
          value={password}
          onChange={onPasswordChange}
          placeholder="Password"
          hideInput={!isPasswordShown}
          onEnter={handleLogin}
        />
        <FlexBox>
          <CheckboxLabel>
            <Checkbox type={"checkbox"} checked={isPasswordShown} onChange={onIsPasswordShownChange} />
            <h6>Show Password</h6>
          </CheckboxLabel>
          <LoginButton>
            <ButtonIcon textOn="Login " icon="bx bx-log-in" onClick={handleLogin} />
          </LoginButton>
        </FlexBox>
      </LoginPageWrapper>
    </LoginPageContainer>
  );
};

export default LoginPage;
