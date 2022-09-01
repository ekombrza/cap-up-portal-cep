import dayjs from 'dayjs/esm';
import { IChurch } from '../church/church.model';

export interface IDenomination {
  id?: number;
  name?: string;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  churches?: IChurch[] | null;
}

export class Denomination implements IDenomination {
  constructor(
    public id?: number,
    public name?: string,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public churches?: IChurch[] | null
  ) {}
}

export function getDenominationIdentifier(denomination: IDenomination): number | undefined {
  return denomination.id;
}
