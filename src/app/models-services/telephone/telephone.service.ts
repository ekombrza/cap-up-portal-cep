import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { getTelephoneIdentifier, ITelephone } from './telephone.model';
import { baseUrlJHipsterApi } from 'src/environments/environment';
import { createRequestOption, isPresent } from 'src/@ekbz/services/utils';

export type EntityResponseType = HttpResponse<ITelephone>;
export type EntityArrayResponseType = HttpResponse<ITelephone[]>;

@Injectable({ providedIn: 'root' })
export class TelephoneService {
  
  constructor(protected http: HttpClient) {}

  public baseUrlExtended = baseUrlJHipsterApi + 'api/extended/telephones';
  public baseUrl = baseUrlJHipsterApi + 'api/telephones';

  create(telephone: ITelephone): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(telephone);
    return this.http
      .post<ITelephone>(this.baseUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(telephone: ITelephone): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(telephone);
    return this.http
      .put<ITelephone>(`${this.baseUrl}/${getTelephoneIdentifier(telephone) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(telephone: ITelephone): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(telephone);
    return this.http
      .patch<ITelephone>(`${this.baseUrl}/${getTelephoneIdentifier(telephone) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITelephone>(`${this.baseUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITelephone[]>(this.baseUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.baseUrl}/${id}`, { observe: 'response' });
  }

  addTelephoneToCollectionIfMissing(
    telephoneCollection: ITelephone[],
    ...telephonesToCheck: (ITelephone | null | undefined)[]
  ): ITelephone[] {
    const telephones: ITelephone[] = telephonesToCheck.filter(isPresent);
    if (telephones.length > 0) {
      const telephoneCollectionIdentifiers = telephoneCollection.map(telephoneItem => getTelephoneIdentifier(telephoneItem)!);
      const telephonesToAdd = telephones.filter(telephoneItem => {
        const telephoneIdentifier = getTelephoneIdentifier(telephoneItem);
        if (telephoneIdentifier == null || telephoneCollectionIdentifiers.includes(telephoneIdentifier)) {
          return false;
        }
        telephoneCollectionIdentifiers.push(telephoneIdentifier);
        return true;
      });
      return [...telephonesToAdd, ...telephoneCollection];
    }
    return telephoneCollection;
  }

  protected convertDateFromClient(telephone: ITelephone): ITelephone {
    return Object.assign({}, telephone, {
      creationDate: telephone.creationDate?.isValid() ? telephone.creationDate.toJSON() : undefined,
      updatedDate: telephone.updatedDate?.isValid() ? telephone.updatedDate.toJSON() : undefined,
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
      res.body.forEach((telephone: ITelephone) => {
        telephone.creationDate = telephone.creationDate ? dayjs(telephone.creationDate) : undefined;
        telephone.updatedDate = telephone.updatedDate ? dayjs(telephone.updatedDate) : undefined;
      });
    }
    return res;
  }
}
