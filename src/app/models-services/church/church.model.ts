import dayjs from 'dayjs/esm';
import { IAdress } from '../adress/adress.model';
import { IDenomination } from '../denomination/denomination.model';
import { IMembre } from '../membre/membre.model';

export interface IChurch {
  id?: number;
  churchName?: string;
  pastorName?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  website?: string | null;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  adress?: IAdress | null;
  denomination?: IDenomination | null;
  membres?: IMembre[] | null;
}

export class Church implements IChurch {
  constructor(
    public id?: number,
    public churchName?: string,
    public pastorName?: string | null,
    public phoneNumber?: string | null,
    public email?: string | null,
    public website?: string | null,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public adress?: IAdress | null,
    public denomination?: IDenomination | null,
    public membres?: IMembre[] | null
  ) {}
}

export function getChurchIdentifier(church: IChurch): number | undefined {
  return church.id;
}
