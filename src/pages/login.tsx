import { GetServerSideProps, NextPage } from "next";
import { checkHashedPassword } from "@server/utils/auth";
import LoginPage from "@client/components/pages/login/login";
import React from "react";

const Login: NextPage = () => {
  return <LoginPage />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const isAuthenticated = checkHashedPassword(ctx.req.cookies?.authToken ?? "");

  if (isAuthenticated) {
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
  }

  return { props: {} };
};

export default Login;
