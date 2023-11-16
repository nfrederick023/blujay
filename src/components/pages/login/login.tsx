import { getCookieSetOptions } from "@client/utils/cookie";
import { login } from "@client/utils/api";
import { screenSizes } from "@client/utils/constants";
import { useCookies } from "react-cookie";
import ButtonIcon from "@client/components/common/shared/button-icons/button-icon";
import Gradient from "@client/components/common/shared/gradient";
import React, { FC, MouseEvent, useState } from "react";
import TextField from "@client/components/common/shared/text-field";
import ToggleIcon from "@client/components/common/shared/toggle-icon";
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
  margin-right: 10px;
  accent-color: ${(p): string => p.theme.highlightLight};
`;

const CheckboxLabel = styled.label`
  color: ${(p): string => p.theme.textContrast};
  user-select: none;
  transtion: 0.2s;
  display: flex;
  margin: auto 0px auto 0px;

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
  margin-bottom: 5px;
`;

const LoginPage: FC = () => {
  const [password, setPassword] = useState("");
  const [, setCookie] = useCookies(["authToken"]);
  const [hasLoginFailed, setHasLoginFailed] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(true);

  const onIsRememberMe = (): void => {
    setIsRememberMe(!isRememberMe);
  };

  const onPasswordChange = (password: string): void => {
    setPassword(password);
  };

  const onIsPasswordShownChange = (e: MouseEvent): void => {
    e.stopPropagation();
    setIsPasswordShown(!isPasswordShown);
  };

  const handleLogin = async (): Promise<void> => {
    setHasLoginFailed(false);
    const res = await login(password);
    if (res.ok) {
      setCookie("authToken", await res.text(), getCookieSetOptions(!isRememberMe));
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
          inputType={isPasswordShown ? "text" : "password"}
          onEnter={handleLogin}
          toggleIcon={
            <ToggleIcon
              isToggled={isPasswordShown}
              onIcon="bx bxs-show"
              offIcon="bx bxs-hide"
              onClick={onIsPasswordShownChange}
            />
          }
        />
        <FlexBox>
          <CheckboxLabel>
            <Checkbox type={"checkbox"} checked={isRememberMe} onChange={onIsRememberMe} />
            <h6>Remeber Me</h6>
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
