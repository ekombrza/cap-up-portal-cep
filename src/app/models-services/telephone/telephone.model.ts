import dayjs from 'dayjs/esm';
import { IMembre } from '../membre/membre.model';

export interface ITelephone {
  id?: number;
  country?: string | null;
  phoneNumber?: string;
  label?: string;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  membre?: IMembre | null;
}

export class Telephone implements ITelephone {
  constructor(
    public id?: number,
    public country?: string | null,
    public phoneNumber?: string,
    public label?: string,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public membre?: IMembre | null
  ) {}
}

export function getTelephoneIdentifier(telephone: ITelephone): number | undefined {
  return telephone.id;
}
