import { Body, Put, ValidationPipe, createHandler } from "next-api-decorators";
import { UpdateVideo } from "./video.dto";
import { updateVideo } from "./video.service";

class VideoController {

  @Put()
  public async UpdateVideo(@Body(ValidationPipe) req: UpdateVideo): Promise<void> {
    await updateVideo(req);
  }
}

export default createHandler(VideoController);