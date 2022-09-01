import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrlJHipsterApi } from 'src/environments/environment';
import { Denomination } from './denomination.model';

import { EntityArrayResponseType, EntityResponseType } from '../adress/adress-service';
import { createRequestOption } from 'src/@ekbz/services/utils';

@Injectable({
  providedIn: 'root'
})
export class DenominationService {

  constructor(private http:HttpClient) { }
  
  public resourceUrl = baseUrlJHipsterApi + 'api/denominations';
  public resourceUrlPublic = baseUrlJHipsterApi + 'api/extendedPublic/denominations';
  
  create(denomination: Denomination): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(denomination);
    return this.http
      .post<Denomination>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(denomination: Denomination): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(denomination);
    return this.http
      .put<Denomination>(`${this.resourceUrl}/${this.getDenominationIdentifier(denomination) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(denomination: Denomination): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(denomination);
    return this.http
      .patch<Denomination>(`${this.resourceUrl}/${this.getDenominationIdentifier(denomination) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<Denomination>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Denomination[]>(this.resourceUrlPublic, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDenominationToCollectionIfMissing(denominationCollection: Denomination[], ...denominationesToCheck: (Denomination | null | undefined)[]): Denomination[] {
    const denominationes: Denomination[] = denominationesToCheck.filter(this.isPresent);
    if (denominationes.length > 0) {
      const denominationCollectionIdentifiers = denominationCollection.map(denominationItem => this.getDenominationIdentifier(denominationItem)!);
      const denominationesToAdd = denominationes.filter(denominationItem => {
        const denominationIdentifier = this.getDenominationIdentifier(denominationItem);
        if (denominationIdentifier == null || denominationCollectionIdentifiers.includes(denominationIdentifier)) {
          return false;
        }
        denominationCollectionIdentifiers.push(denominationIdentifier);
        return true;
      });
      return [...denominationesToAdd, ...denominationCollection];
    }
    return denominationCollection;
  }

  protected convertDateFromClient(denomination: Denomination): Denomination {
    return Object.assign({}, denomination, {
      creationDate: denomination.creationDate?.isValid() ? denomination.creationDate.toJSON() : undefined,
      updatedDate: denomination.updatedDate?.isValid() ? denomination.updatedDate.toJSON() : undefined,
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
      res.body.forEach((denomination: Denomination) => {
        denomination.creationDate = denomination.creationDate ? dayjs(denomination.creationDate) : undefined;
        denomination.updatedDate = denomination.updatedDate ? dayjs(denomination.updatedDate) : undefined;
      });
    }
    return res;
  }
  
  getDenominationIdentifier(denomination: Denomination): number | undefined {
    return denomination.id;
  }

  isPresent<T>(t: T | undefined | null | void): t is T {
    return t !== undefined && t !== null;
  }

}