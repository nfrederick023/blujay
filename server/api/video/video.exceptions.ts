import { HttpException } from "next-api-decorators";

export class FileFormatNotAllowed extends HttpException {
  public constructor(message = "One (or More) Uploaded File Formats are not Allowed") {
    super(400, message);
  }
}

export class VideoNotFoundException extends HttpException {
  public constructor(message = "No Video Found") {
    super(400, message);
  }
}

export class VideoValidationFailed extends HttpException {
  public constructor(message = "Unable to Validate One (or More) Videos") {
    super(500, message);
  }
}

export class UpdateVideoFailedException extends HttpException {
  public constructor(message = "Failed to update video") {
    super(500, message);
  }
}