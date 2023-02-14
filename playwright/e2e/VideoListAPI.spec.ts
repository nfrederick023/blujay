import { Video } from "../utils/types";
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
const newVideo: Video = {
  fileName: "clip 2.mp4",
  name: "clip 2",
  size: 90166437,
  saved: 1653772935450.1248,
  created: 1675991830454.355,
  filePath: "C:\\test\\videos\\clip 2.mp4",
  thumbnailPath: "\\test\\thumbnails\\clip 2.jpg",
  description: "",
  requireAuth: false,
  isFavorite: false,
  id: "56153922"
};

const newVideo1: Video = {
  fileName: "clip 2.mp4",
  name: "clip 2",
  size: 90166437,
  saved: 1653772935450.1248,
  created: 1675991830454.355,
  filePath: "C:\\test\\videos\\clip 2.mp4",
  thumbnailPath: "\\test\\thumbnails\\clip 2.jpg",
  description: "",
  requireAuth: false,
  isFavorite: false,
  id: "doesNotExsist"
};

const newVideo2 = {
  id: "56153922"
};

test("Should recieve a 200", async ({ page, request }) => {
  await page.goto("/");
  const req = await request.put("/api/videoList", { headers: { Cookie: `authToken=${authToken}` }, data: { ...newVideo } });
  expect(req.status()).toBe(200);
});

test("Should recieve a 401", async ({ page, request }) => {
  await page.goto("/");
  const req = await request.put("/api/videoList", { data: { ...newVideo } });
  expect(req.status()).toBe(401);
});

test("Should recieve a 404", async ({ page, request }) => {
  await page.goto("/");
  const req = await request.put("/api/videoList", { headers: { Cookie: `authToken=${authToken}` }, data: { ...newVideo1 } });
  expect(req.status()).toBe(404);
});

test("Should recieve a 405", async ({ page, request }) => {
  await page.goto("/");
  const req = await request.post("/api/videoList", { headers: { Cookie: `authToken=${authToken}` }, data: { ...newVideo } });
  expect(req.status()).toBe(405);
});

test("Should recieve a 400", async ({ page, request }) => {
  await page.goto("/");
  const req = await request.put("/api/videoList", { headers: { Cookie: `authToken=${authToken}` }, data: { ...newVideo2 } });
  expect(req.status()).toBe(400);
});




