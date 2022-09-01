import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from 'src/@ekbz/services/utils';
import { baseUrlJHipsterApi } from 'src/environments/environment';
import { Church } from './church.model';
export type EntityResponseType = HttpResponse<Church>;
export type EntityArrayResponseType = HttpResponse<Church[]>;

@Injectable({
  providedIn: 'root'
})
export class ChurchService {

  constructor(private http:HttpClient) { }
  
  public resourceUrl = baseUrlJHipsterApi + 'api/churches';
  public resourceUrlPublic = baseUrlJHipsterApi + 'api/extendedPublic/churches';

  private _church: ReplaySubject<Church> = new ReplaySubject<Church>(1);

  // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for church
     *
     * @param value
     */
     set church(value: Church)
     {
         // Store the value
         this._church.next(value);
     }
 
     get church$(): Observable<Church>
     {
         return this._church.asObservable();
     }
 
     // -----------------------------------------------------------------------------------------------------
     // @ Public methods
     // -----------------------------------------------------------------------------------------------------
 
     /**
      * Get the current logged in user data
      */
     get(): Observable<Church>
     {
         return this.http.get<Church>(`${this.resourceUrlPublic}/current`).pipe(
             tap((church) => {
                 this._church.next(church);
             })
         );
     }
  
  create(church: Church): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(church);
    return this.http
      .post<Church>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(church: Church): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(church);
    return this.http
      .put<Church>(`${this.resourceUrl}/${this.getChurchIdentifier(church) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(church: Church): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(church);
    return this.http
      .patch<Church>(`${this.resourceUrl}/${this.getChurchIdentifier(church) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<Church>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Church[]>(this.resourceUrlPublic, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addChurchToCollectionIfMissing(churchCollection: Church[], ...churchesToCheck: (Church | null | undefined)[]): Church[] {
    const churches: Church[] = churchesToCheck.filter(this.isPresent);
    if (churches.length > 0) {
      const churchCollectionIdentifiers = churchCollection.map(churchItem => this.getChurchIdentifier(churchItem)!);
      const churchesToAdd = churches.filter(churchItem => {
        const churchIdentifier = this.getChurchIdentifier(churchItem);
        if (churchIdentifier == null || churchCollectionIdentifiers.includes(churchIdentifier)) {
          return false;
        }
        churchCollectionIdentifiers.push(churchIdentifier);
        return true;
      });
      return [...churchesToAdd, ...churchCollection];
    }
    return churchCollection;
  }

  protected convertDateFromClient(church: Church): Church {
    return Object.assign({}, church, {
      creationDate: church.creationDate?.isValid() ? church.creationDate.toJSON() : undefined,
      updatedDate: church.updatedDate?.isValid() ? church.updatedDate.toJSON() : undefined,
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
      res.body.forEach((church: Church) => {
        church.creationDate = church.creationDate ? dayjs(church.creationDate) : undefined;
        church.updatedDate = church.updatedDate ? dayjs(church.updatedDate) : undefined;
      });
    }
    return res;
  }
  
  getChurchIdentifier(church: Church): number | undefined {
    return church.id;
  }

  isPresent<T>(t: T | undefined | null | void): t is T {
    return t !== undefined && t !== null;
  }
}
