import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { getDemandeAccesFormationPriveeIdentifier, IDemandeAccesFormationPrivee } from './demande-acces-formation-privee.model';
import { baseUrlJHipsterApi } from 'src/environments/environment';
import { createRequestOption, isPresent } from 'src/@ekbz/services/utils';


export type EntityResponseType = HttpResponse<IDemandeAccesFormationPrivee>;
export type EntityArrayResponseType = HttpResponse<IDemandeAccesFormationPrivee[]>;

@Injectable({ providedIn: 'root' })
export class DemandeAccesFormationPriveeService {
  public resourceUrl = baseUrlJHipsterApi + 'api/demande-acces-formation-privees';
  public resourceUrlExtended = baseUrlJHipsterApi + 'api/extended/demande-acces-formation-privees';

  constructor(protected http: HttpClient) {}

  create(demandeAccesFormationPrivee: IDemandeAccesFormationPrivee): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(demandeAccesFormationPrivee);
    return this.http
      .post<IDemandeAccesFormationPrivee>(this.resourceUrlExtended, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(demandeAccesFormationPrivee: IDemandeAccesFormationPrivee): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(demandeAccesFormationPrivee);
    return this.http
      .put<IDemandeAccesFormationPrivee>(
        `${this.resourceUrl}/${getDemandeAccesFormationPriveeIdentifier(demandeAccesFormationPrivee) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(demandeAccesFormationPrivee: IDemandeAccesFormationPrivee): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(demandeAccesFormationPrivee);
    return this.http
      .patch<IDemandeAccesFormationPrivee>(
        `${this.resourceUrl}/${getDemandeAccesFormationPriveeIdentifier(demandeAccesFormationPrivee) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDemandeAccesFormationPrivee>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDemandeAccesFormationPrivee[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDemandeAccesFormationPriveeToCollectionIfMissing(
    demandeAccesFormationPriveeCollection: IDemandeAccesFormationPrivee[],
    ...demandeAccesFormationPriveesToCheck: (IDemandeAccesFormationPrivee | null | undefined)[]
  ): IDemandeAccesFormationPrivee[] {
    const demandeAccesFormationPrivees: IDemandeAccesFormationPrivee[] = demandeAccesFormationPriveesToCheck.filter(isPresent);
    if (demandeAccesFormationPrivees.length > 0) {
      const demandeAccesFormationPriveeCollectionIdentifiers = demandeAccesFormationPriveeCollection.map(
        demandeAccesFormationPriveeItem => getDemandeAccesFormationPriveeIdentifier(demandeAccesFormationPriveeItem)!
      );
      const demandeAccesFormationPriveesToAdd = demandeAccesFormationPrivees.filter(demandeAccesFormationPriveeItem => {
        const demandeAccesFormationPriveeIdentifier = getDemandeAccesFormationPriveeIdentifier(demandeAccesFormationPriveeItem);
        if (
          demandeAccesFormationPriveeIdentifier == null ||
          demandeAccesFormationPriveeCollectionIdentifiers.includes(demandeAccesFormationPriveeIdentifier)
        ) {
          return false;
        }
        demandeAccesFormationPriveeCollectionIdentifiers.push(demandeAccesFormationPriveeIdentifier);
        return true;
      });
      return [...demandeAccesFormationPriveesToAdd, ...demandeAccesFormationPriveeCollection];
    }
    return demandeAccesFormationPriveeCollection;
  }

  protected convertDateFromClient(demandeAccesFormationPrivee: IDemandeAccesFormationPrivee): IDemandeAccesFormationPrivee {
    return Object.assign({}, demandeAccesFormationPrivee, {
      creationDate: demandeAccesFormationPrivee.creationDate?.isValid() ? demandeAccesFormationPrivee.creationDate.toJSON() : undefined,
      updatedDate: demandeAccesFormationPrivee.updatedDate?.isValid() ? demandeAccesFormationPrivee.updatedDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.creationDate = res.body.creationDate ? dayjs(res.body.creationDate) : undefined;
      res.body.updatedDate = res.body.updatedDate ? dayjs(res.body.updatedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((demandeAccesFormationPrivee: IDemandeAccesFormationPrivee) => {
        demandeAccesFormationPrivee.creationDate = demandeAccesFormationPrivee.creationDate
          ? dayjs(demandeAccesFormationPrivee.creationDate)
          : undefined;
        demandeAccesFormationPrivee.updatedDate = demandeAccesFormationPrivee.updatedDate
          ? dayjs(demandeAccesFormationPrivee.updatedDate)
          : undefined;
      });
    }
    return res;
  }
}
