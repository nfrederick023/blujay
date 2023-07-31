import { FC } from "react";
import { GetServerSideProps } from "next/types";
import { authGuard } from "@server/utils/auth";
import NotFoundPage from "@client/components/pages/error/not-found";
import React from "react";

const NotFound: FC = () => {
  return <NotFoundPage />;
};

export const getServerSideProps: GetServerSideProps = authGuard(async () => {
  return {
    props: {},
  };
});

export default NotFound;
