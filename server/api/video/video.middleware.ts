import { FileFormatNotAllowed } from "./video.exceptions";
import { fileMimeTypes } from "@client/utils/constants";
import { getLibraryPath } from "@server/utils/config";
import multer, { diskStorage } from "multer";

export const videoUpload = multer({
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, getLibraryPath());
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (!fileMimeTypes.includes(file.mimetype)) {
      return cb(new FileFormatNotAllowed());
    }
    cb(null, true);
  }
}).array("file");