import { Body, Get, Param, Put, ValidationPipe, createHandler } from "next-api-decorators";
import { UpdateVideo } from "./videoList.dto";
import { getVideoList, updateVideoList } from "./videoList.service";
import type { OrderType, QueryField, SortType, Video } from "@client/utils/types";

class VideoListController {

  @Get()
  public async getVideoList(
    @Param("page") page?: number,
    @Param("size") size?: number,
    @Param("sort") sort?: SortType,
    @Param("order") order?: OrderType,
    @Param("query") query?: string,
    @Param("queryField") queryField?: QueryField[]
  ): Promise<Video[]> {
    return await getVideoList(page || 0, size || 5, sort || "Alphabetical", order || "Ascending", query || "", queryField || []);
  }

  @Put()
  public async UpdateVideoList(@Body(ValidationPipe) req: UpdateVideo): Promise<Video> {
    return await updateVideoList(req);
  }
}

export default createHandler(VideoListController);