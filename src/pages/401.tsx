import { FC } from "react";
// import { GetServerSideProps } from "next";
// import { authGuard } from "@server/utils/auth";
import React from "react";
import UnauthorizedPage from "@client/components/pages/error/unauthorized";

const NotFound: FC = () => {
  return <UnauthorizedPage />;
};

// export const getServerSideProps: GetServerSideProps = authGuard(async () => {
//   return {
//     props: {},
//   };
// });

export default NotFound;
