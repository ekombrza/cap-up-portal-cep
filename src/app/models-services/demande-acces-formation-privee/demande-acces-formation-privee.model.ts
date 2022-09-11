import dayjs from 'dayjs/esm';

export interface IDemandeAccesFormationPrivee {
  id?: number;
  idDemandeur?: number;
  nomDemandeur?: string;
  prenomDemandeur?: string;
  idRessourceToActive?: number;
  nomRessourceToActive?: string;
  creationDate?: dayjs.Dayjs;
  updatedDate?: dayjs.Dayjs | null;
}

export class DemandeAccesFormationPrivee implements IDemandeAccesFormationPrivee {
  constructor(
    public id?: number,
    public idDemandeur?: number,
    public nomDemandeur?: string,
    public prenomDemandeur?: string,
    public idRessourceToActive?: number,
    public nomRessourceToActive?: string,
    public creationDate?: dayjs.Dayjs,
    public updatedDate?: dayjs.Dayjs | null
  ) {}
}

export function getDemandeAccesFormationPriveeIdentifier(demandeAccesFormationPrivee: IDemandeAccesFormationPrivee): number | undefined {
  return demandeAccesFormationPrivee.id;
}
