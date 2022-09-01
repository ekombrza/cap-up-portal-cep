import dayjs from 'dayjs/esm';
import { IApplicationData } from '../application-data/application-data.model';
import { IChurch } from '../church/church.model';
import { IRole } from '../role/role.model';
import { IFeedback } from '../feedback/feedback.model';
import { JobStatus } from '../job-status/job-status.model';
import { IUser } from '../user/user.model';

export interface IMembre {
  id?: number;
  phoneNumber?: string | null;
  inAppNotification?: boolean | null;
  emailNotification?: boolean | null;
  imageBlobContentType?: string | null;
  imageBlob?: string | null;
  jobStatus?: JobStatus | null;
  instantStatus?: string | null;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  internalUser?: IUser | null;
  applicationsData?: IApplicationData[] | null;
  church?: IChurch | null;
  roles?: IRole[] | null;
  feedbacks?: IFeedback[] | null;
}

export class Membre implements IMembre {
  constructor(
    public id?: number,
    public phoneNumber?: string | null,
    public inAppNotification?: boolean | null,
    public emailNotification?: boolean | null,
    public imageBlobContentType?: string | null,
    public imageBlob?: string | null,
    public jobStatus?: JobStatus | null,
    public instantStatus?: string | null,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public internalUser?: IUser | null,
    public applicationsData?: IApplicationData[] | null,
    public church?: IChurch | null,
    public roles?: IRole[] | null,
    public feedbacks?: IFeedback[] | null
  ) {
    this.inAppNotification = this.inAppNotification ?? false;
    this.emailNotification = this.emailNotification ?? false;
  }
}

export function getMembreIdentifier(membre: IMembre): number | undefined {
  return membre.id;
}
