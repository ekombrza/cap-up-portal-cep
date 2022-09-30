import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import { Observable, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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

  private _membre: ReplaySubject<Membre> = new ReplaySubject<Membre>(1);

   // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for membre
     *
     * @param value
     */
     set membre(value: Membre)
     {
         // Store the value
         this._membre.next(value);
     }
 
     get membre$(): Observable<Membre>
     {
         return this._membre.asObservable();
     }
 
     // -----------------------------------------------------------------------------------------------------
     // @ Public methods
     // -----------------------------------------------------------------------------------------------------
 
     /**
      * Get the current logged in membre data
      */
     get(): Observable<Membre>
     {
         return this.http.get<Membre>(`${this.baseUrlExtended}/current`).pipe(
             tap((membre) => {
                 this._membre.next(membre);
             })
         );
     }
  
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

  update(membre: Membre, isConnectedMembre:boolean): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(membre);
    return this.http
      .put<Membre>(`${this.resourceUrl}/${this.getMembreIdentifier(membre) as number}`, membre, { observe: 'response' })
      .pipe(tap((res) => { if(isConnectedMembre) this._membre.next(res.body)} ))
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(membre: Membre, isConnectedMembre:boolean): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(membre);
    return this.http
      .patch<Membre>(`${this.resourceUrl}/${this.getMembreIdentifier(membre) as number}`, copy, { observe: 'response' })
      .pipe(tap((res) => { if(isConnectedMembre) this._membre.next(res.body)} ))
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

  /**
     * Update the avatar of the given membre (the connected membre only)
     *
     * @param id
     * @param avatar
     */
   uploadAvatar(id: number, avatar: FormData): Observable<Membre>
   {
       return this.http.post<Membre>(this.baseUrlExtended + '/upload/' + id, 
               avatar
           ).pipe(
               map((updatedMembre: Membre) => {``
                  this._membre.next(updatedMembre);
                   // Return the updated membre
                   return updatedMembre;
               })
           )
   }
}
