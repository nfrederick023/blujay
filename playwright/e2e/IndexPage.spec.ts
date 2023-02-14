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

test("Should be able to set to dark mode", async ({ page, context }) => {
  await context.addCookies([{ name: "isDarkMode", value: "false", url: "http://localhost:8000/" }]);
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.click(".react-toggle-thumb");
  let url;
  page.on("response", response => {
    url = response.url();
  });

  await page.waitForTimeout(1500);
  expect(url).toContain("bulma");
});

test("Should be able to only show and unshow favorites", async ({ page, context }) => {
  await context.addCookies([{ name: "authToken", value: authToken, url: "http://localhost:8000/" }]);
  await page.goto("/");
  await page.click("span:text('Only Show Favorites')");
  expect(await page.locator("td:text(\"clip 2\")").isVisible()).toBeTruthy();
  expect(await page.locator("td:text(\"clip 4\")").isVisible()).toBeTruthy();
  expect(await page.locator("td:text(\"clip 3\")").isVisible()).toBeFalsy();
  expect(await page.locator("td:text(\"clip 1\")").isVisible()).toBeFalsy();
  await page.click("span:text('Only Show Favorites')");
  expect(await page.locator("td:text(\"clip 3\")").isVisible()).toBeTruthy();
  expect(await page.locator("td:text(\"clip 1\")").isVisible()).toBeTruthy();
});

test("Should be able to change videos per page", async ({ page, context }) => {
  await context.addCookies([{ name: "authToken", value: authToken, url: "http://localhost:8000/" }]);
  await page.goto("/");
  await page.click(".fa-cog");
  await page.locator(".dropdown-content .input").clear();
  expect(await page.locator(".dropdown-content .input").inputValue()).toBe("0");
  await page.locator(".dropdown-content .input").type("1");
  await page.click("label:text('page')");
  expect(await page.locator("a:text('1')").first().isVisible()).toBeTruthy();
  expect(await page.locator("a:text('2')").first().isVisible()).toBeTruthy();
  expect(await page.locator("a:text('3')").first().isVisible()).toBeTruthy();
  expect(await page.locator("a:text('4')").first().isVisible()).toBeTruthy();
});

test("Should be able to change current page", async ({ page, context }) => {
  await context.addCookies([{ name: "authToken", value: authToken, url: "http://localhost:8000/" }, { name: "videosPerPage", value: "1", url: "http://localhost:8000/" }]);
  await page.goto("/");
  expect(await page.locator("td:text('clip 3')").isVisible()).toBeTruthy();
  await page.locator("a:text('2')").first().click();
  expect(await page.locator("td:text('clip 4')").isVisible()).toBeTruthy();
  await page.locator("a:text('3')").first().click();
  expect(await page.locator("td:text('clip 2')").isVisible()).toBeTruthy();
  await page.locator("a:text('4')").first().click();
  expect(await page.locator("td:text('clip 1')").isVisible()).toBeTruthy();

  await page.locator(".fa-caret-left").first().click();
  expect(await page.locator("td:text('clip 2')").isVisible()).toBeTruthy();
  await page.locator(".fa-caret-left").first().click();
  expect(await page.locator("td:text('clip 4')").isVisible()).toBeTruthy();
  await page.locator(".fa-caret-left").first().click();
  expect(await page.locator("td:text('clip 3')").isVisible()).toBeTruthy();

  await page.locator(".fa-caret-right").first().click();
  expect(await page.locator("td:text('clip 4')").isVisible()).toBeTruthy();
  await page.locator(".fa-caret-right").first().click();
  expect(await page.locator("td:text('clip 2')").isVisible()).toBeTruthy();
  await page.locator(".fa-caret-right").first().click();
  expect(await page.locator("td:text('clip 1')").isVisible()).toBeTruthy();
});

test("Should be able to change sort", async ({ page, context }) => {
  await context.addCookies([{ name: "authToken", value: authToken, url: "http://localhost:8000/" }]);
  await page.goto("/");
  await page.locator("th:text('Created')").click();
  expect(await page.locator("td").nth(3).innerText()).toBe("clip 4");
  await page.locator("th:text('Created')").click();
  expect(await page.locator("td").nth(3).innerText()).toBe("clip 1");

  await page.locator("th:text('Uploaded')").click();
  expect(await page.locator("td").nth(3).innerText()).toBe("clip 3");
  await page.locator("th:text('Uploaded')").click();
  expect(await page.locator("td").nth(3).innerText()).toBe("clip 1");

  await page.locator("th:text('Size')").click();
  expect(await page.locator("td").nth(3).innerText()).toBe("clip 1");
  await page.locator("th:text('Size')").click();
  expect(await page.locator("td").nth(3).innerText()).toBe("clip 3");

  await page.locator("th:text('Name')").click();
  expect(await page.locator("td").nth(3).innerText()).toBe("clip 4");
  await page.locator("th:text('Name')").click();
  expect(await page.locator("td").nth(3).innerText()).toBe("clip 1");
});