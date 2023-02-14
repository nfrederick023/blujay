import { exec, spawn } from "node:child_process";
import { expect, test } from "@playwright/test";
import fse from "fs-extra";

test.beforeAll(() => {
  spawn("next dev", [], { env: { PASSWORD: "test", PRIVATE_LIBRARY: "true", APP_PATH: "/test", NODE_ENV: "development", PORT: "8000" }, shell: true });
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

test("Should display video name, size, and upload size", async ({ page }) => {
  await page.goto("/watch/56153922");
  expect(await page.locator("h1:text(\"clip 2\")").isVisible()).toBeTruthy();
  expect(await page.locator("h2:text(\"uploaded\")").isVisible()).toBeTruthy();
  expect(await page.locator("h2:text(\"clip 2.mp4\")").isVisible()).toBeTruthy();
  expect(await page.locator("h2:text(\"MB\")").isVisible()).toBeTruthy();
});

test("Should be able to toggle theatre mode", async ({ page }) => {
  await page.goto("/watch/56153922");
  expect(await page.locator(".theater-mode").isVisible()).toBeFalsy();
  await page.click("span:text('Theater mode')");
  expect(await page.locator(".theater-mode").isVisible()).toBeTruthy();
  await page.click("span:text('Theater mode')");
  expect(await page.locator(".theater-mode").isVisible()).toBeFalsy();
});

test("Should be able to keep theatre mode setttings between pages", async ({ page }) => {
  await page.goto("/watch/56153922");
  expect(await page.locator(".theater-mode").isVisible()).toBeFalsy();
  await page.click("span:text('Theater mode')");
  expect(await page.locator(".theater-mode").isVisible()).toBeTruthy();
  await page.reload();
  expect(await page.locator(".theater-mode").isVisible()).toBeTruthy();
});

test("Should be able to click logo and navigate back to index", async ({ page, context }) => {
  await context.addCookies([{ name: "authToken", value: authToken, url: "http://localhost:8000/" }]);
  await page.goto("/watch/56153922");
  await page.click("nav .title");
  await page.locator("td:text(\"clip 1\")").waitFor({ state: "visible" });
});


