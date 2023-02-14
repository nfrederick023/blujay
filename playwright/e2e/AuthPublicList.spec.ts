import { exec, spawn } from "node:child_process";
import { expect, test } from "@playwright/test";
import fse from "fs-extra";

test.beforeAll(() => {
  spawn("next dev", [], { env: { PASSWORD: "test", PRIVATE_LIBRARY: "false", APP_PATH: "/test", NODE_ENV: "development", PORT: "8000" }, shell: true });
});

test.beforeEach(async () => {
  const defaultVideoList = await fse.readJSON("/test/config/video_list_default.json");
  fse.writeJSONSync("/test/config/video_list.json", defaultVideoList);
});

test.afterAll(async ({ page }) => {
  exec("npx kill-port 8000");
  await page.waitForTimeout(5000);
});

const authToken = "d95146ef88e5bfcd3c33ccb610c07a3fde2b3ab47c00a7185b68c32cc214572db32c45a31b0e7feca45133d369a29ab8";

test("Should be able to view index as public user", async ({ page }) => {
  await page.goto("/");
  await page.locator("td:text(\"clip 1\")").waitFor({ state: "visible" });
  expect(page.url().includes("login")).toBeFalsy();
  expect(await page.locator("td:text(\"clip 3\")").isVisible()).toBeFalsy();
});

test("Should redirect to login from private link as a public user", async ({ page }) => {
  await page.goto("/watch/30659904");
  expect(page.url().includes("login")).toBeTruthy();
});

test("Should be able to view a public link as a public user", async ({ page }) => {
  await page.goto("/watch/56473756");
  await page.locator("h1:text(\"clip 1\")").waitFor({ state: "visible" });
  expect(await page.locator("p:text(\"public link\")").isVisible()).toBeTruthy();
});

test("Should be able to view a private link as an authorized user", async ({ page, context }) => {
  await context.addCookies([{ name: "authToken", value: authToken, url: "http://localhost:8000/" }]);
  await page.goto("/watch/30659904");
  await page.locator("h1:text(\"clip 3\")").waitFor({ state: "visible" });
  expect(await page.locator("p:text(\"public link\")").isVisible()).toBeFalsy();
});

test("Should be able to select a clip as an authorized user", async ({ page, context }) => {
  await context.addCookies([{ name: "authToken", value: authToken, url: "http://localhost:8000/" }]);
  await page.goto("/");
  await page.click("td:text(\"clip 1\")");
  await page.locator("h1:text(\"clip 1\")").waitFor({ state: "visible" });
});

test("Should not see public link message as an authorized user", async ({ page, context }) => {
  await context.addCookies([{ name: "authToken", value: authToken, url: "http://localhost:8000/" }]);
  await page.goto("/watch/56473756");
  await page.locator("h1:text(\"clip 1\")").waitFor({ state: "visible" });
  expect(await page.locator("p:text(\"public link\")").isVisible()).toBeFalsy();
});