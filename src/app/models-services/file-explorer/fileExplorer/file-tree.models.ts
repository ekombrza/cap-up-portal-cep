import { IFile } from './file.models';

export interface IFileTree {
    currentDirectory?: IFile;
    parentDirectory?: IFile;
    childDirectories?: IFile[];
    files?:IFile[];
  }
  
  export class FileTree implements IFileTree {
    constructor(
      public currentDirectory?: IFile,
      public parentDirectory?: IFile,
      public childDirectories?: IFile[],
      public files?: IFile[],
    ) {}
  }