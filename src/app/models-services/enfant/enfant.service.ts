import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { getEnfantIdentifier, IEnfant } from './enfant.model';
import { baseUrlJHipsterApi } from 'src/environments/environment';
import { createRequestOption, isPresent } from 'src/@ekbz/services/utils';

export type EntityResponseType = HttpResponse<IEnfant>;
export type EntityArrayResponseType = HttpResponse<IEnfant[]>;

@Injectable({ providedIn: 'root' })
export class EnfantService {

  constructor(protected http: HttpClient) {}

  public resourceUrl = baseUrlJHipsterApi + 'api/enfants';
  public resourceUrlPublic = baseUrlJHipsterApi + 'api/extendedPublic/enfants';

  create(enfant: IEnfant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(enfant);
    return this.http
      .post<IEnfant>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(enfant: IEnfant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(enfant);
    return this.http
      .put<IEnfant>(`${this.resourceUrl}/${getEnfantIdentifier(enfant) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(enfant: IEnfant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(enfant);
    return this.http
      .patch<IEnfant>(`${this.resourceUrl}/${getEnfantIdentifier(enfant) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEnfant>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEnfant[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEnfantToCollectionIfMissing(enfantCollection: IEnfant[], ...enfantsToCheck: (IEnfant | null | undefined)[]): IEnfant[] {
    const enfants: IEnfant[] = enfantsToCheck.filter(isPresent);
    if (enfants.length > 0) {
      const enfantCollectionIdentifiers = enfantCollection.map(enfantItem => getEnfantIdentifier(enfantItem)!);
      const enfantsToAdd = enfants.filter(enfantItem => {
        const enfantIdentifier = getEnfantIdentifier(enfantItem);
        if (enfantIdentifier == null || enfantCollectionIdentifiers.includes(enfantIdentifier)) {
          return false;
        }
        enfantCollectionIdentifiers.push(enfantIdentifier);
        return true;
      });
      return [...enfantsToAdd, ...enfantCollection];
    }
    return enfantCollection;
  }

  protected convertDateFromClient(enfant: IEnfant): IEnfant {
    return Object.assign({}, enfant, {
      creationDate: enfant.creationDate?.isValid() ? enfant.creationDate.toJSON() : undefined,
      updatedDate: enfant.updatedDate?.isValid() ? enfant.updatedDate.toJSON() : undefined,
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
      res.body.forEach((enfant: IEnfant) => {
        enfant.creationDate = enfant.creationDate ? dayjs(enfant.creationDate) : undefined;
        enfant.updatedDate = enfant.updatedDate ? dayjs(enfant.updatedDate) : undefined;
      });
    }
    return res;
  }
}
