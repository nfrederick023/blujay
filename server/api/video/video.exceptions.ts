import { HttpException } from "next-api-decorators";

export class VideoNotFoundException extends HttpException {
  public constructor(message = "No Video Found") {
    super(400, message);
  }
}

export class UpdateVideoFailedException extends HttpException {
  public constructor(message = "Failed to update video!") {
    super(500, message);
  }
}