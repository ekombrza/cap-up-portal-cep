import { Byte } from "@angular/compiler/src/util";

export interface IFileContent {
    fileNName?: string;
    content?: Byte[];
  }
  
  export class FileContent implements IFileContent {
    constructor(
      public fileNName?: string,
      public content?: Byte[],
    ) {}
  }