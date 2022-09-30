import dayjs from 'dayjs/esm';
import { IGroupe } from '../groupe/groupe.model';
import { IMembre } from '../membre/membre.model';


export interface IPoste {
  id?: number;
  nom?: string;
  ordreAffichage?: number | null;
  idEglise?: number;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  groupes?: IGroupe | null;
  membres?: IMembre[] | null;
}

export class Poste implements IPoste {
  constructor(
    public id?: number,
    public nom?: string,
    public ordreAffichage?: number | null,
    public idEglise?: number,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public groupes?: IGroupe | null,
    public membres?: IMembre[] | null
  ) {}
}

export function getPosteIdentifier(poste: IPoste): number | undefined {
  return poste.id;
}
