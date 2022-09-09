import dayjs from 'dayjs/esm';
import { TypeRoleEnum } from './type-role-enum.model';
import {IApplication} from '../application/application.model';
import {IMembre} from '../membre/membre.model';
import {IResource} from '../ressource/resource.model';

export interface IRole {
  id?: number;
  name?: string;
  description?: string | null;
  typeRole?: TypeRoleEnum;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  application?: IApplication | null;
  membres?: IMembre[] | null;
  resources?: IResource[] | null;
}

export class Role implements IRole {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string | null,
    public typeRole?: TypeRoleEnum,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public application?: IApplication | null,
    public membres?: IMembre[] | null,
    public resources?: IResource[] | null
  ) {}
}

export function getRoleIdentifier(role: IRole): number | undefined {
  return role.id;
}

export interface RolePagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}
