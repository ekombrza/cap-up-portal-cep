import dayjs from 'dayjs/esm';
import { IMembre } from '../membre/membre.model';

export interface ITypeAdhesion {
  id?: number;
  code?: string;
  libelle?: string;
  idChurch?: number | null;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  membres?: IMembre[] | null;
}

export class TypeAdhesion implements ITypeAdhesion {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public idChurch?: number | null,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public membres?: IMembre[] | null
  ) {}
}

export function getTypeAdhesionIdentifier(typeAdhesion: ITypeAdhesion): number | undefined {
  return typeAdhesion.id;
}
