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

test("Should be able to set clip to private as an authorized user", async ({ page, context }) => {
  await context.addCookies([{ name: "authToken", value: authToken, url: "http://localhost:8000/" }]);
  await page.goto("/");
  await page.locator(".fa-globe").first().click();
  await page.waitForTimeout(1500);
  expect((await page.locator(".fa-lock").all()).length).toBe(3);

  await context.clearCookies();
  await page.goto("/watch/56153922");
  await page.locator("p:text('password protected')").waitFor({ state: "visible" });
  expect(page.url().includes("login")).toBeTruthy();
});

test("Should be able to set clip to public as an authorized user", async ({ page, context }) => {
  await context.addCookies([{ name: "authToken", value: authToken, url: "http://localhost:8000/" }]);
  await page.goto("/");
  await page.locator(".fa-lock").first().click();
  await page.waitForTimeout(1500);
  expect((await page.locator(".fa-globe").all()).length).toBe(3);

  await context.clearCookies();
  await page.goto("/watch/30659904");
  await page.locator("h1:text(\"clip 3\")").waitFor({ state: "visible" });
  expect(await page.locator("p:text(\"public link\")").isVisible()).toBeTruthy();
});

test("Should not be able to modify video privacy settings as a public user", async ({ page }) => {
  await page.goto("/");
  await page.locator("td:text(\"clip 1\")").waitFor({ state: "visible" });
  expect(await page.locator("td:text(\"clip 3\")").isVisible()).toBeFalsy();
  expect(await page.locator("td:text(\"clip 4\")").isVisible()).toBeFalsy();
  expect(await page.locator(".fa-lock").isVisible()).toBeFalsy();

  await page.locator(".fa-star").first().click();
  expect((await page.locator(".fa-star").all()).length).toBe(1);
});

test("Should be able to see setting changes when navigating pages", async ({ page, context }) => {
  await context.addCookies([{ name: "authToken", value: authToken, url: "http://localhost:8000/" }]);
  await page.goto("/");
  await page.locator(".fa-globe").first().click();
  await page.waitForTimeout(1500);
  expect((await page.locator(".fa-lock").all()).length).toBe(3);

  await page.goto("/watch/56153922");
  expect((await page.locator(".fa-lock").all()).length).toBe(1);
  expect((await page.locator(".fa-globe").all()).length).toBe(0);
});

test("Should be able to see setting changes when reloading pages", async ({ page, context }) => {
  await context.addCookies([{ name: "authToken", value: authToken, url: "http://localhost:8000/" }]);
  await page.goto("/");
  await page.locator(".fa-globe").first().click();
  await page.waitForTimeout(1500);
  expect((await page.locator(".fa-lock").all()).length).toBe(3);

  await page.reload();
  await page.waitForTimeout(1500);
  expect((await page.locator(".fa-lock").all()).length).toBe(3);
});

test("Should be able to favorite a clip as an authorized user", async ({ page, context }) => {
  await context.addCookies([{ name: "authToken", value: authToken, url: "http://localhost:8000/" }]);
  await page.goto("/");
  await page.locator(".fas.fa-star").first().click();
  await page.waitForTimeout(1500);
  expect((await page.locator(".far.fa-star").all()).length).toBe(3);
});

test("Should be able to unfavorite a clip as an authorized user", async ({ page, context }) => {
  await context.addCookies([{ name: "authToken", value: authToken, url: "http://localhost:8000/" }]);
  await page.goto("/");
  await page.locator(".far.fa-star").first().click();
  await page.waitForTimeout(1500);
  expect((await page.locator(".fas.fa-star").all()).length).toBe(3);
});

test("Should be able to copy link", async ({ page, context }) => {
  await context.addCookies([{ name: "authToken", value: authToken, url: "http://localhost:8000/" }]);
  await page.goto("/");
  await page.locator(".fa-link").first().click();
});