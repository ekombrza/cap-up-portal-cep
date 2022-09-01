import dayjs from 'dayjs/esm';
import { ICountry } from '../country/country.model';
import { IChurch } from '../church/church.model';

export interface IAdress {
  id?: number;
  adress1?: string;
  adress2?: string | null;
  city?: string;
  region?: string | null;
  postalCode?: string;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  country?: ICountry | null;
  church?: IChurch | null;
}

export class Adress implements IAdress {
  constructor(
    public id?: number,
    public adress1?: string,
    public adress2?: string | null,
    public city?: string,
    public region?: string | null,
    public postalCode?: string,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public country?: ICountry | null,
    public church?: IChurch | null
  ) {}
}

export function getAdressIdentifier(adress: IAdress): number | undefined {
  return adress.id;
}
