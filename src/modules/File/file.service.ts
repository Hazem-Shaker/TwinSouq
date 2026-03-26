import { MarkFileAsUsedLogic } from "./mark-file-as-used";
import { MarkFileAsUnusedLogic } from "./mark-files-as-unused";
import { mongo } from "mongoose";

export class FileService {
  markFileAsUsedLogic: MarkFileAsUsedLogic;
  markFilesAsUnusedLogic: MarkFileAsUnusedLogic;
  constructor() {
    this.markFileAsUsedLogic = new MarkFileAsUsedLogic();
    this.markFilesAsUnusedLogic = new MarkFileAsUnusedLogic();
  }

  async markFileAsUsed(
    fileIds: string[],
    userId: string,
    session: mongo.ClientSession
  ) {
    console.log("markFileAsUsed", fileIds, userId);
    return this.markFileAsUsedLogic.markFileAsUsed(
      { fileIds, userId },
      session
    );
  }

  async markFilesAsUnused(
    fileIds: string[],
    userId: string,
    session: mongo.ClientSession
  ) {
    return this.markFilesAsUnusedLogic.markFilesAsUnused(
      { fileIds, userId },
      session
    );
  }
}
