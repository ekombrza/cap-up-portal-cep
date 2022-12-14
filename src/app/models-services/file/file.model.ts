import dayjs from 'dayjs/esm';
import { ITypeFile } from '../type-file/type-file.model';
import { ISectionResource } from '../section-ressource/section-resource.model';
import { IResource } from '../ressource/resource.model';

export interface IFile {
  id?: number;
  filename?: string;
  filePathName?: string;
  nbPage?: number | null;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  typeFile?: ITypeFile | null;
  resource?: IResource | null;
  sectionResource?: ISectionResource | null;
}

export class File implements IFile {
  constructor(
    public id?: number,
    public filename?: string,
    public filePathName?: string,
    public nbPage?: number | null,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public typeFile?: ITypeFile | null,
    public resource?: IResource | null,
    public sectionResource?: ISectionResource | null
  ) {}
}

export function getFileIdentifier(file: IFile): number | undefined {
  return file.id;
}
