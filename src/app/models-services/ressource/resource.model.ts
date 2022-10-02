import dayjs from 'dayjs/esm';
import { IFeedback } from '../feedback/feedback.model';
import { ISectionResource } from '../section-ressource/section-resource.model';
import { ICategorie } from '../categorie/categorie.model';
import { IRole } from '../role/role.model';
import { IApplicationData } from '../application-data/application-data.model';
import { TypeResourceEnum } from './type-resource-enum.model';
import { IFile } from '../file/file.model';

export interface IResource {
  id?: number;
  title?: string;
  imageLink?: string | null;
  description?: string;
  nbReadForPopularity?: number | null;
  typeResourceEnum?: TypeResourceEnum;
  publish?: boolean;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  filePdf?: IFile | null;
  feedbacks?: IFeedback[] | null;
  sectionResources?: ISectionResource[] | null;
  relatedContent?: IResource | null;
  categories?: ICategorie[] | null;
  roles?: IRole[] | null;
  membresVieweds?: IApplicationData[] | null;
  membresBookmarks?: IApplicationData[] | null;
  membresSharedWithYous?: IApplicationData[] | null;
}

export class Resource implements IResource {
  constructor(
    public id?: number,
    public title?: string,
    public imageLink?: string | null,
    public description?: string,
    public nbReadForPopularity?: number | null,
    public typeResourceEnum?: TypeResourceEnum,
    public publish?: boolean,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public filePdf?: IFile | null,
    public feedbacks?: IFeedback[] | null,
    public sectionResources?: ISectionResource[] | null,
    public relatedContent?: IResource | null,
    public categories?: ICategorie[] | null,
    public roles?: IRole[] | null,
    public membresVieweds?: IApplicationData[] | null,
    public membresBookmarks?: IApplicationData[] | null,
    public membresSharedWithYous?: IApplicationData[] | null
  ) {}
}

export function getResourceIdentifier(resource: IResource): number | undefined {
  return resource.id;
}
