import { Body, Post, Put, Req, Res, ValidationPipe, createHandler } from "next-api-decorators";
import { UpdateVideo } from "./video.dto";
import { UploadFailedException } from "./video.exceptions";
import { deleteVideo, getLibraryPath, getTempPath, getVideo, moveVideoToLibrary } from "@server/utils/config";
import { listVideos } from "@server/utils/listVideos";
import { updateVideo } from "./video.service";
import { validateVideo } from "@server/utils/validateVideo";
import multer, { diskStorage } from "multer";
import path from "path";
import type { Request, Response } from "express";

class VideoController {

  @Post()
  public async UploadVideo(@Req() req: Request, @Res() res: Response): Promise<void> {
    const upload = multer({
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, getTempPath());
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname);
          req.on("aborted", () => {
            file.stream.on("end", () => {
              const tempPath = path.join(getTempPath() + file.originalname);
              deleteVideo(tempPath);
            });
            file.stream.emit("end");
          });
        }
      }),
      fileFilter: (req, file, cb) => {
        const tempPath = path.join(getTempPath() + file.originalname);
        const libraryPath = path.join(getLibraryPath() + file.originalname);
        if (getVideo(tempPath) || getVideo(libraryPath)) {
          cb(new Error("File Already Exists"));
        } else {
          cb(null, true);
        }
      }
    });

    try {
      // Multer deletes the file from temp for us ONLY IF this promise fails
      const file = await new Promise<Express.Multer.File>((resolve, reject) => {
        upload.single("file")(req, res, async (err): Promise<void> => {
          if (err) {
            reject(err);
          }
          if (req.file) {
            resolve(req.file);
          } else {
            reject("File Upload Failed");
          }
        });
      });

      try {
        await validateVideo(file.path);
        moveVideoToLibrary(file.path);
        await listVideos();
      } catch (e) {
        // the file won't be deleted from temp if Multer was successful
        deleteVideo(file.path);
        throw (e);
      }
    } catch (e) {
      res.writeHead(500, { "connection": "close" });
      throw new UploadFailedException(e as string);
    }
  }

  @Put()
  public async UpdateVideo(@Body(ValidationPipe) req: UpdateVideo): Promise<void> {
    await updateVideo(req);
  }
}

export default createHandler(VideoController);