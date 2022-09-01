import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { createRequestOption } from 'src/@ekbz/services/utils';
import { baseUrlJHipsterApi } from 'src/environments/environment';
import { Adress } from '../adress/adress.model';
import { Church } from '../church/church.model';
export type EntityResponseType = HttpResponse<Church>;
export type EntityArrayResponseType = HttpResponse<Church[]>;

@Injectable({
  providedIn: 'root'
})
export class AdressService {

  constructor(private http:HttpClient) { }
  
  public resourceUrl = baseUrlJHipsterApi + 'api/adresses';
  
  create(adress: Adress): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(adress);
    return this.http
      .post<Adress>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(adress: Adress): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(adress);
    return this.http
      .put<Adress>(`${this.resourceUrl}/${this.getAdressIdentifier(adress) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(adress: Adress): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(adress);
    return this.http
      .patch<Adress>(`${this.resourceUrl}/${this.getAdressIdentifier(adress) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<Adress>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Adress[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAdressToCollectionIfMissing(adressCollection: Adress[], ...adressesToCheck: (Adress | null | undefined)[]): Adress[] {
    const adresses: Adress[] = adressesToCheck.filter(this.isPresent);
    if (adresses.length > 0) {
      const adressCollectionIdentifiers = adressCollection.map(adressItem => this.getAdressIdentifier(adressItem)!);
      const adressesToAdd = adresses.filter(adressItem => {
        const adressIdentifier = this.getAdressIdentifier(adressItem);
        if (adressIdentifier == null || adressCollectionIdentifiers.includes(adressIdentifier)) {
          return false;
        }
        adressCollectionIdentifiers.push(adressIdentifier);
        return true;
      });
      return [...adressesToAdd, ...adressCollection];
    }
    return adressCollection;
  }

  protected convertDateFromClient(adress: Adress): Adress {
    return Object.assign({}, adress, {
      creationDate: adress.creationDate?.isValid() ? adress.creationDate.toJSON() : undefined,
      updatedDate: adress.updatedDate?.isValid() ? adress.updatedDate.toJSON() : undefined,
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
      res.body.forEach((adress: Adress) => {
        adress.creationDate = adress.creationDate ? dayjs(adress.creationDate) : undefined;
        adress.updatedDate = adress.updatedDate ? dayjs(adress.updatedDate) : undefined;
      });
    }
    return res;
  }
  
  getAdressIdentifier(adress: Adress): number | undefined {
    return adress.id;
  }

  isPresent<T>(t: T | undefined | null | void): t is T {
    return t !== undefined && t !== null;
  }
}
