import { GetServerSideProps, NextPage } from "next";
import LibraryPage from "@client/components/pages/library/library";
import React from "react";

const Library: NextPage = () => {
  return <LibraryPage />;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};

export default Library;
