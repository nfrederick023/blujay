import { Body, Post, Put, UploadedFiles, UseMiddleware, ValidationPipe, createHandler } from "next-api-decorators";
import { UpdateVideo } from "./video.dto";
import { updateVideo, validateFiles } from "./video.service";
import { videoUpload } from "./video.middleware";

class VideoController {

  @Post()
  @UseMiddleware(videoUpload)
  public async UploadVideo(@UploadedFiles() files: Express.Multer.File[]): Promise<void> {
    await validateFiles(files);
  }

  @Put()
  public async UpdateVideo(@Body(ValidationPipe) req: UpdateVideo): Promise<void> {
    await updateVideo(req);
  }
}

export default createHandler(VideoController);