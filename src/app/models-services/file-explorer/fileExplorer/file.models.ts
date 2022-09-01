export interface IFile {
    name?: string;
    size?: string;
    path?: string;
    readable?: boolean;
    writable?: boolean;
    executable?:boolean;
    fullName?: string;
    dateTime?: string;
    accessAttributes?: string;
    isDirectory?: boolean;
  }
  
  export class File implements IFile {
    constructor(
      public name?: string,
      public size?: string,
      public path?: string,
      public readable?:boolean,
      public writable?:boolean,
      public executable?:boolean,
      public fullName?: string,
      public dateTime?: string,
      public accessAttributes?: string,
      public isDirectory?:boolean,
    ) {}
  }