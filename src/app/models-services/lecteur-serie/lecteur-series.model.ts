import dayjs from 'dayjs/esm';
import { ISectionResource } from '../section-ressource/section-resource.model';
import { TypeLecteurEnum } from './type-lecteur-enum.model';

export interface ILecteurSeries {
  id?: number;
  titre?: string;
  supportLink?: string;
  imageLink?: string;
  order?: number;
  typeLecteurEnum?: TypeLecteurEnum;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  sectionResource?: ISectionResource | null;
  endReaded?: boolean;
}

export class LecteurSeries implements ILecteurSeries {
  constructor(
    public id?: number,
    public titre?: string,
    public supportLink?: string,
    public imageLink?: string,
    public order?: number,
    public typeLecteurEnum?: TypeLecteurEnum,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public sectionResource?: ISectionResource | null,
    public endReaded?: boolean,
  ) {}
}

export function getLecteurSeriesIdentifier(lecteurSeries: ILecteurSeries): number | undefined {
  return lecteurSeries.id;
}
