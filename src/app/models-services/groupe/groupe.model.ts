import dayjs from 'dayjs/esm';
import { IMembre } from '../membre/membre.model';
import { IPoste } from '../poste/poste.model';


export interface IGroupe {
  id?: number;
  nom?: string;
  ordreAffichage?: number | null;
  idEglise?: number;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  postes?: IPoste[] | null;
  membres?: IMembre[] | null;
}

export class Groupe implements IGroupe {
  constructor(
    public id?: number,
    public nom?: string,
    public ordreAffichage?: number | null,
    public idEglise?: number,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public postes?: IPoste[] | null,
    public membres?: IMembre[] | null
  ) {}
}

export function getGroupeIdentifier(groupe: IGroupe): number | undefined {
  return groupe.id;
}
