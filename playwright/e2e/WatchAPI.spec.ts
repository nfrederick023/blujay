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

test("Should recieve a 200", async ({ page, request }) => {
  await page.goto("/");
  const req = await request.get("/api/watch/30659904", { headers: { Cookie: `authToken=${authToken}` } });
  expect(req.status()).toBe(200);
});

test("Should recieve a 401", async ({ page, request }) => {
  await page.goto("/");
  const req = await request.get("/api/watch/30659904");
  expect(req.status()).toBe(401);
});

test("Should recieve a 404", async ({ page, request }) => {
  await page.goto("/");
  const req = await request.get("/api/watch/thisDoesNotExsist", { headers: { Cookie: `authToken=${authToken}` } });
  expect(req.status()).toBe(404);
});

test("Should recieve a 405", async ({ page, request }) => {
  await page.goto("/");
  const req = await request.post("/api/watch/30659904", { headers: { Cookie: `authToken=${authToken}` } });
  expect(req.status()).toBe(405);
});




