import dayjs from 'dayjs/esm';
import { IResource } from '../ressource/resource.model';
import { TypeResourceEnum } from '../ressource/type-resource-enum.model';

export interface ICategorie {
  id?: number;
  name?: string;
  typeResourceEnum?: TypeResourceEnum;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  resources?: IResource[] | null;
}

export class Categorie implements ICategorie {
  constructor(
    public id?: number,
    public name?: string,
    public typeResourceEnum?: TypeResourceEnum,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public resources?: IResource[] | null
  ) {}
}

export function getCategorieIdentifier(categorie: ICategorie): number | undefined {
  return categorie.id;
}

export interface CategoriePagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}
