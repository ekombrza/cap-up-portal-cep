import dayjs from 'dayjs/esm';
import { IRole } from '../role/role.model';
import { IApplicationData } from '../application-data/application-data.model';

export interface IApplication {
  id?: number;
  name?: string;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  roles?: IRole[] | null;
  applicationsData?: IApplicationData[] | null;
}

export class Application implements IApplication {
  constructor(
    public id?: number,
    public name?: string,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public roles?: IRole[] | null,
    public applicationsData?: IApplicationData[] | null
  ) {}
}

export function getApplicationIdentifier(application: IApplication): number | undefined {
  return application.id;
}
