import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { createRequestOption } from 'src/@ekbz/services/utils';
import { baseUrlJHipsterApi } from 'src/environments/environment';
import { Membre } from './membre.model';
export type EntityResponseType = HttpResponse<Membre>;
export type EntityArrayResponseType = HttpResponse<Membre[]>;

@Injectable({
  providedIn: 'root'
})
export class MembreService {

  constructor(private http:HttpClient) { }
  
  public baseUrlExtended = baseUrlJHipsterApi + 'api/extended/membres';
  public baseUrl = baseUrlJHipsterApi + 'api/membres';
  public resourceUrl = baseUrlJHipsterApi + 'api/membres';
  
  queryCurrentUser(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    var response = this.http
      .get<string[]>(this.baseUrlExtended + '/current', { params: options, observe: 'response' });
    return response;
  }



  create(membre: Membre): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(membre);
    return this.http
      .post<Membre>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(membre: Membre): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(membre);
    return this.http
      .put<Membre>(`${this.resourceUrl}/${this.getMembreIdentifier(membre) as number}`, membre, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(membre: Membre): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(membre);
    return this.http
      .patch<Membre>(`${this.resourceUrl}/${this.getMembreIdentifier(membre) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<Membre>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Membre[]>(this.baseUrlExtended, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  queryGlobale(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Membre[]>(this.baseUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  queryNonEntended(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Membre[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.baseUrlExtended}/${id}`, { observe: 'response' });
  }

  addMembreToCollectionIfMissing(membreCollection: Membre[], ...membresToCheck: (Membre | null | undefined)[]): Membre[] {
    const membres: Membre[] = membresToCheck.filter(this.isPresent);
    if (membres.length > 0) {
      const membreCollectionIdentifiers = membreCollection.map(membreItem => this.getMembreIdentifier(membreItem)!);
      const membresToAdd = membres.filter(membreItem => {
        const membreIdentifier = this.getMembreIdentifier(membreItem);
        if (membreIdentifier == null || membreCollectionIdentifiers.includes(membreIdentifier)) {
          return false;
        }
        membreCollectionIdentifiers.push(membreIdentifier);
        return true;
      });
      return [...membresToAdd, ...membreCollection];
    }
    return membreCollection;
  }

  protected convertDateFromClient(membre: Membre): Membre {
    return Object.assign({}, membre, {
      creationDate: membre.creationDate?.isValid() ? membre.creationDate.toJSON() : undefined,
      updatedDate: membre.updatedDate?.isValid() ? membre.updatedDate.toJSON() : undefined,
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
      res.body.forEach((membre: Membre) => {
        membre.creationDate = membre.creationDate ? dayjs(membre.creationDate) : undefined;
        membre.updatedDate = membre.updatedDate ? dayjs(membre.updatedDate) : undefined;
      });
    }
    return res;
  }

  getMembreIdentifier(membre: Membre): number | undefined {
    return membre.id;
  }
  
  isPresent<T>(t: T | undefined | null | void): t is T {
    return t !== undefined && t !== null;
  }
}
