import { KeepAliveComponenet } from "@client/utils/types";
import { NextPage } from "next";
import { withKeepAlive } from "react-next-keep-alive";
import FavoritesPage from "@client/components/pages/favorites/favorites";
import React from "react";

const Favorites: NextPage = () => {
  return <FavoritesPage />;
};

export default withKeepAlive(Favorites as KeepAliveComponenet, "favorites_page");
