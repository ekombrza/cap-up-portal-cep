import dayjs from 'dayjs/esm';
import { IFile } from '../file/file.model';
import { ILecteurSeries } from '../lecteur-serie/lecteur-series.model';
import { IResource } from '../ressource/resource.model';

export interface ISectionResource {
  id?: number;
  title?: string;
  contentSection?: string | null;
  orderSection?: number;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  files?: IFile[] | null;
  lecteurSeries?: ILecteurSeries[] | null;
  resource?: IResource | null;
}

export class SectionResource implements ISectionResource {
  constructor(
    public id?: number,
    public title?: string,
    public contentSection?: string | null,
    public orderSection?: number,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public files?: IFile[] | null,
    public lecteurSeries?: ILecteurSeries[] | null,
    public resource?: IResource | null
  ) {}
}

export function getSectionResourceIdentifier(sectionResource: ISectionResource): number | undefined {
  return sectionResource.id;
}
