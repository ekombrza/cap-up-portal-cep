import dayjs from 'dayjs/esm';
import { IApplication } from '../application/application.model';
import { IResource } from '../ressource/resource.model';
import { IMembre } from '../membre/membre.model';

export interface IApplicationData {
  id?: number;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  application?: IApplication | null;
  resourcesVieweds?: IResource[] | null;
  resourcesBookmarks?: IResource[] | null;
  resourcesSharedWithYous?: IResource[] | null;
  membre?: IMembre | null;
}

export class ApplicationData implements IApplicationData {
  constructor(
    public id?: number,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public application?: IApplication | null,
    public resourcesVieweds?: IResource[] | null,
    public resourcesBookmarks?: IResource[] | null,
    public resourcesSharedWithYous?: IResource[] | null,
    public membre?: IMembre | null
  ) {}
}

export function getApplicationDataIdentifier(applicationData: IApplicationData): number | undefined {
  return applicationData.id;
}
