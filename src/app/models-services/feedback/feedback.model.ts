import dayjs from 'dayjs/esm';
import { IMembre } from '../membre/membre.model';
import { IResource } from '../ressource/resource.model';

export interface IFeedback {
  id?: number;
  note?: number | null;
  desciption?: string;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  membre?: IMembre | null;
  resource?: IResource | null;
}

export class Feedback implements IFeedback {
  constructor(
    public id?: number,
    public note?: number | null,
    public desciption?: string,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public membre?: IMembre | null,
    public resource?: IResource | null
  ) {}
}

export function getFeedbackIdentifier(feedback: IFeedback): number | undefined {
  return feedback.id;
}
