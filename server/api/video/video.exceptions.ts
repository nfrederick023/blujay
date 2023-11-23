import { HttpException } from "next-api-decorators";

export class ValidationException extends HttpException {
  public constructor(message: string) {
    super(500, "Unable to Validate File: " + message);
  }
}

export class AlreadyExistsException extends HttpException {
  public constructor() {
    super(400, "File Already Exists");
  }
}

export class UploadFailedException extends HttpException {
  public constructor() {
    super(500, "Failed to Upload File");
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