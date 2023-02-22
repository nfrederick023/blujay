import { NextPageContext, Redirect } from "next";

import { NextRedirect } from "../types/types";

const getRedirect = (url: string): NextRedirect => {
  const redirect: Redirect = {
    destination: url,
    permanent: false,
  };

  return { redirect };
};

export const redirectToLogin = (ctx: NextPageContext): NextRedirect => {
  const urlToRedirect = ctx.req?.url && !ctx.req?.url?.includes("_next") ? "/login?next=" + encodeURIComponent(ctx.req.url ? ctx.req.url : "") : "/login";
  return getRedirect(urlToRedirect);
};

export const redirectToIndex = (): NextRedirect => {
  return getRedirect("/");
};

export const redirectTo404 = (): NextRedirect => {
  return getRedirect("/error/404");
};

export const redirectTo401 = (): NextRedirect => {
  return getRedirect("/error/401");
};