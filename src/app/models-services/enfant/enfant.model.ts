import dayjs from 'dayjs/esm';
import { IMembre } from '../membre/membre.model';

export interface IEnfant {
  id?: number;
  prenom?: string;
  anneeNaissance?: number | null;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  membre?: IMembre | null;
}

export class Enfant implements IEnfant {
  constructor(
    public id?: number,
    public prenom?: string,
    public anneeNaissance?: number | null,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public membre?: IMembre | null
  ) {}
}

export function getEnfantIdentifier(enfant: IEnfant): number | undefined {
  return enfant.id;
}
