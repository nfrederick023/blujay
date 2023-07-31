import { GetServerSideProps, NextPage } from "next";
import { authGuard } from "@server/utils/auth";
import LibraryPage from "@client/components/pages/library/library";
import React from "react";

const Library: NextPage = () => {
  return <LibraryPage />;
};

export const getServerSideProps: GetServerSideProps = authGuard(async () => {
  return {
    props: {},
  };
});

export default Library;
