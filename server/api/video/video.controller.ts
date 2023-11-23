import { Body, Post, Put, Req, Res, ValidationPipe, createHandler } from "next-api-decorators";
import { UpdateVideo } from "./video.dto";
import { UploadFailedException } from "./video.exceptions";
import { deleteVideo, getLibraryPath, getTempPath, getVideo } from "@server/utils/config";
import { updateVideo, validateFiles } from "./video.service";
import multer, { diskStorage } from "multer";
import type { Request, Response } from "express";

class VideoController {

  @Post()
  public async UploadVideo(@Req() req: Request, @Res() res: Response): Promise<void> {
    let filename = "";

    const upload = multer({
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, getTempPath());
        },
        filename: (req, file, cb) => {
          filename = file.originalname;
          cb(null, file.originalname);
        }
      }),
      fileFilter: (req, file, cb) => {
        if (getVideo(getLibraryPath() + file.originalname) || getVideo(getTempPath() + file.originalname)) {
          cb(null, false);
        } else {
          cb(null, true);
        }
      }
    });

    let currentFileSize = 0;

    req.on("data", (chunk) => {
      currentFileSize += chunk.length;
    });

    req.on("close", () => {
      // if the file upload was incomplete
      if (filename && currentFileSize.toString() !== req.headers["content-length"]) {
        deleteVideo(getLibraryPath() + filename);
      }
    });

    try {
      await new Promise<void>((resolve, reject) => {
        upload.single("file")(req, res, async (err): Promise<void> => {
          if (!req.file || err) {
            reject(err);
            return;
          }
          try {
            await validateFiles(req.file.path);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });
    } catch (e) {
      throw new UploadFailedException();
    }
  }

  @Put()
  public async UpdateVideo(@Body(ValidationPipe) req: UpdateVideo): Promise<void> {
    await updateVideo(req);
  }
}

export default createHandler(VideoController);