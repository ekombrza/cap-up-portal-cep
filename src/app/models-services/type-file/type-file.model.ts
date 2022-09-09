import dayjs from 'dayjs/esm';
import { IFile } from '../file/file.model';

export interface ITypeFile {
  id?: number;
  name?: string;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  files?: IFile[] | null;
}

export class TypeFile implements ITypeFile {
  constructor(
    public id?: number,
    public name?: string,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public files?: IFile[] | null
  ) {}
}

export function getTypeFileIdentifier(typeFile: ITypeFile): number | undefined {
  return typeFile.id;
}

export interface TypefilePagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}