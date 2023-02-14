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

test("Should recieve a 200", async ({ page, request }) => {
  await page.goto("/");
  const req = await request.post("/api/login", { data: { password: "test" } });
  expect(req.status()).toBe(200);
});

test("Should recieve a 405", async ({ page, request }) => {
  await page.goto("/");
  const req = await request.put("/api/login", { data: { password: "test" } });
  expect(req.status()).toBe(405);
});

test("Should recieve a 401", async ({ page, request }) => {
  await page.goto("/");
  const req = await request.post("/api/login", { data: { password: "test1" } });
  expect(req.status()).toBe(401);
});

test("Should recieve a 400", async ({ page, request }) => {
  exec("npx kill-port 8000");
  await page.waitForTimeout(5000);
  spawn("next dev", [], { env: { PASSWORD: "undefined", PRIVATE_LIBRARY: "true", APP_PATH: "/test", NODE_ENV: "development", PORT: "8000" }, shell: true });

  await page.goto("/");
  const req = await request.post("/api/login", { data: { password: "test" } });
  expect(req.status()).toBe(400);
});
