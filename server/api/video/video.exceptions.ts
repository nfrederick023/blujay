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