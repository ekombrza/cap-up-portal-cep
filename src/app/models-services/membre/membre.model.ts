import dayjs from 'dayjs/esm';
import { IApplicationData } from '../application-data/application-data.model';
import { IChurch } from '../church/church.model';
import { IRole } from '../role/role.model';
import { IFeedback } from '../feedback/feedback.model';
import { JobStatus } from '../job-status/job-status.model';
import { IUser } from '../user/user.model';
import { IAdress } from '../adress/adress.model';
import { IShortcuts } from 'src/app/layout/common/shortcuts/shortcuts.types';
import { ITelephone } from '../telephone/telephone.model';
import { IEnfant } from '../enfant/enfant.model';
import { ISituationFamille } from '../situation-famille/situation-famille.model';
import { ITypeAdhesion } from '../type-adhesion/type-adhesion.model';
import { IPoste } from '../poste/poste.model';
import { IGroupe } from '../groupe/groupe.model';


export interface IMembre {
  id?: number;
  civilite?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  birthDate?: dayjs.Dayjs | null;
  background?:string | null;
  avatarImageLink?: string | null;
  phoneNumber?: string | null;
  inAppNotification?: boolean | null;
  emailNotification?: boolean | null;
  imageBlobContentType?: string | null;
  imageBlob?: string | null;
  jobStatus?: JobStatus | null;
  instanxtStatus?: string | null;
  baptiseDepuis?: dayjs.Dayjs | null;
  frequenteEgliseDepuis?: dayjs.Dayjs | null;
  nomConjoint?: string | null;
  prenomConjoint?: string | null;
  idConjoint?: number | null;
  notes?: string | null;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
  adress?: IAdress | null;
  internalUser?: IUser | null;
  applicationsData?: IApplicationData[] | null;
  shortcuts?: IShortcuts[] | null;
  telephones?: ITelephone[] | null;
  enfants?: IEnfant[] | null;
  church?: IChurch | null;
  situationFamille?: ISituationFamille | null;
  typeAdhesion?: ITypeAdhesion | null;
  roles?: IRole[] | null;
  postes?: IPoste[] | null;
  feedbacks?: IFeedback[] | null;
  groupes?: IGroupe[] | null;
}

export class Membre implements IMembre {
  constructor(
    public id?: number,
    public civilite?: string | null,
    public firstName?: string | null,
    public lastName?: string | null,
    public email?: string | null,
    public birthDate?: dayjs.Dayjs | null,
    public avatarImageLink?: string | null,
    public background?: string | null,
    public phoneNumber?: string | null,
    public inAppNotification?: boolean | null,
    public emailNotification?: boolean | null,
    public imageBlobContentType?: string | null,
    public imageBlob?: string | null,
    public jobStatus?: JobStatus | null,
    public instantStatus?: string | null,
    public baptiseDepuis?: dayjs.Dayjs | null,
    public frequenteEgliseDepuis?: dayjs.Dayjs | null,
    public nomConjoint?: string | null,
    public prenomConjoint?: string | null,
    public idConjoint?: number | null,
    public notes?: string | null,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null,
    public adress?: IAdress | null,
    public internalUser?: IUser | null,
    public applicationsData?: IApplicationData[] | null,
    public shortcuts?: IShortcuts[] | null,
    public telephones?: ITelephone[] | null,
    public enfants?: IEnfant[] | null,
    public church?: IChurch | null,
    public situationFamille?: ISituationFamille | null,
    public typeAdhesion?: ITypeAdhesion | null,
    public roles?: IRole[] | null,
    public postes?: IPoste[] | null,
    public feedbacks?: IFeedback[] | null,
    public groupes?: IGroupe[] | null
  ) {
    this.inAppNotification = this.inAppNotification ?? false;
    this.emailNotification = this.emailNotification ?? false;
  }
}

export function getMembreIdentifier(membre: IMembre): number | undefined {
  return membre.id;
}
