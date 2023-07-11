import { Get, Param, createHandler } from "next-api-decorators";
import { getVideoList } from "./videoList.service";
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
}

export default createHandler(VideoListController);