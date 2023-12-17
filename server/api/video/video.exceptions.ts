import { HttpException } from "next-api-decorators";

export class UploadFailedException extends HttpException {
  public constructor(message: string) {
    super(500, "Failed to Upload File: " + message);
  }
}

export class NotFoundException extends HttpException {
  public constructor() {
    super(400, "No File Found");
  }
}

export class UpdateException extends HttpException {
  public constructor() {
    super(500, "Failed to Update File");
  }
}

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