/* eslint-disable */
const config = require("config");
const fse = require("fs-extra");

// backs up video list on startup
(async function main () {
  const assetsPath = config.get("app_path") + "/config/";
  const videoListPath = assetsPath + "video_list.json"
  const backupDir = assetsPath + "backups/"
  if (fse.existsSync(videoListPath)) {
    const videoList = await fse.readJSON(videoListPath);
    if (!fse.existsSync(backupDir))
      await fse.mkdir(backupDir);
    await fse.writeJSON(backupDir + "video_list.json", videoList);
  }
})();

module.exports = {
  publicRuntimeConfig: {
    // Will be available on both server and client
    pageTitle: config.get("page_title"),
    hasAuth: !!(config.has("password") ? config.get("password") : undefined),
  },
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  }
};
