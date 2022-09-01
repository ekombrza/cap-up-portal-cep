import dayjs from 'dayjs/esm';
import { IAdress } from '../adress/adress.model';

export interface ICountry {
  id?: number;
  name?: string;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  adresses?: IAdress[] | null;
}

export class Country implements ICountry {
  constructor(
    public id?: number,
    public name?: string,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public adresses?: IAdress[] | null
  ) {}
}

export function getCountryIdentifier(country: ICountry): number | undefined {
  return country.id;
}
