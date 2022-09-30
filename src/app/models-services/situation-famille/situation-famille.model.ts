import dayjs from 'dayjs/esm';
import { IMembre } from '../membre/membre.model';

export interface ISituationFamille {
  id?: number;
  code?: string;
  libelle?: string;
  idChurch?: number | null;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  membres?: IMembre[] | null;
}

export class SituationFamille implements ISituationFamille {
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

export function getSituationFamilleIdentifier(situationFamille: ISituationFamille): number | undefined {
  return situationFamille.id;
}
