import "server-only";
import { getDirListOfLibrarySubfolders } from "@server/utils/config";
import React, { FC } from "react";

export const SidebarContent: () => Promise<JSX.Element> = async () => {
  const libraryDirs = await getDirListOfLibrarySubfolders();

  return <></>;
};
