import dayjs from 'dayjs/esm';
import { IApplicationData } from '../application-data/application-data.model';

export interface IRessourceStatsLectureVideo {
  id?: number;
  idResource?: number | null;
  statsLectureVideo?: string | null;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  applicationData?: IApplicationData | null;
}

export class RessourceStatsLectureVideo implements IRessourceStatsLectureVideo {
  constructor(
    public id?: number,
    public idResource?: number | null,
    public statsLectureVideo?: string | null,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public applicationData?: IApplicationData | null
  ) {}
}

export function getRessourceStatsLectureVideoIdentifier(ressourceStatsLectureVideo: IRessourceStatsLectureVideo): number | undefined {
  return ressourceStatsLectureVideo.id;
}
