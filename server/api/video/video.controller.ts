import { Body, Delete, Get, Param, Patch, Post, Put, Req, Res, ValidationPipe, createHandler } from "next-api-decorators";
import { DeleteVideo, RenameFile, UpdateVideo } from "./video.dto";
import { UploadFailedException } from "./video.exceptions";
import { deleteVideo, getLibraryPath, getTempPath, getVideo, moveVideoToLibrary } from "@server/utils/config";
import { deletevideo, getVideos, renameFile, updateVideo } from "./video.service";
import { listVideos } from "@server/utils/listVideos";
import { validateVideo } from "@server/utils/validateVideo";
import multer, { diskStorage } from "multer";
import path from "path";
import type { OrderType, QueryField, SortType, Video } from "@client/utils/types";
import type { Request, Response } from "express";

class VideoController {

  // mostly unused framework for video pagination, would be a nightmare to implement app wide right now
  @Get()
  public async GetVideos(
    @Param("page") page?: number,
    @Param("size") size?: number,
    @Param("sort") sort?: SortType,
    @Param("order") order?: OrderType,
    @Param("query") query?: string,
    @Param("queryField") queryField?: QueryField[]
  ): Promise<Video[]> {
    return await getVideos(page || 0, size || 5, sort || "Alphabetical", order || "Ascending", query || "", queryField || []);
  }

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

  @Delete()
  public async DeleteVideo(@Body(ValidationPipe) req: DeleteVideo): Promise<void> {
    deletevideo(req);
  }

  @Put()
  public UpdateVideo(@Body(ValidationPipe) req: UpdateVideo): void {
    updateVideo(req);
  }

  @Patch()
  public async RenameFile(@Body(ValidationPipe) req: RenameFile): Promise<Video> {
    return await renameFile(req);
  }
}

export default createHandler(VideoController);