import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { getSituationFamilleIdentifier, ISituationFamille, SituationFamille } from './situation-famille.model';
import { baseUrlJHipsterApi } from 'src/environments/environment';
import { createRequestOption, isPresent } from 'src/@ekbz/services/utils';


export type EntityResponseType = HttpResponse<ISituationFamille>;
export type EntityArrayResponseType = HttpResponse<ISituationFamille[]>;



@Injectable({ providedIn: 'root' })
export class SituationFamilleService {
    
    public baseUrlExtended = baseUrlJHipsterApi + 'api/extended/situation-familles';
    public baseUrl = baseUrlJHipsterApi + 'api/situation-familles';

    private _situationsFamille: BehaviorSubject<SituationFamille[] | null> = new BehaviorSubject(null);

  constructor(protected http: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for membre
     */
     get situationsFamille$(): Observable<SituationFamille[]>
     {
         return this._situationsFamille.asObservable();
     }
 
     // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get membres
     */
    getSituationsFamille(req?: any): Observable<SituationFamille[]>
    {
        const options = createRequestOption(req);
        return this.http.get<SituationFamille[]>(this.baseUrl, { params: options}).pipe(
            tap((situations) => {
                this._situationsFamille.next(situations);
            })
        );
    }

  create(situationFamille: ISituationFamille): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(situationFamille);
    return this.http
      .post<ISituationFamille>(this.baseUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(situationFamille: ISituationFamille): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(situationFamille);
    return this.http
      .put<ISituationFamille>(`${this.baseUrl}/${getSituationFamilleIdentifier(situationFamille) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(situationFamille: ISituationFamille): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(situationFamille);
    return this.http
      .patch<ISituationFamille>(`${this.baseUrl}/${getSituationFamilleIdentifier(situationFamille) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISituationFamille>(`${this.baseUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISituationFamille[]>(this.baseUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.baseUrl}/${id}`, { observe: 'response' });
  }

  addSituationFamilleToCollectionIfMissing(
    situationFamilleCollection: ISituationFamille[],
    ...situationFamillesToCheck: (ISituationFamille | null | undefined)[]
  ): ISituationFamille[] {
    const situationFamilles: ISituationFamille[] = situationFamillesToCheck.filter(isPresent);
    if (situationFamilles.length > 0) {
      const situationFamilleCollectionIdentifiers = situationFamilleCollection.map(
        situationFamilleItem => getSituationFamilleIdentifier(situationFamilleItem)!
      );
      const situationFamillesToAdd = situationFamilles.filter(situationFamilleItem => {
        const situationFamilleIdentifier = getSituationFamilleIdentifier(situationFamilleItem);
        if (situationFamilleIdentifier == null || situationFamilleCollectionIdentifiers.includes(situationFamilleIdentifier)) {
          return false;
        }
        situationFamilleCollectionIdentifiers.push(situationFamilleIdentifier);
        return true;
      });
      return [...situationFamillesToAdd, ...situationFamilleCollection];
    }
    return situationFamilleCollection;
  }

  protected convertDateFromClient(situationFamille: ISituationFamille): ISituationFamille {
    return Object.assign({}, situationFamille, {
      creationDate: situationFamille.creationDate?.isValid() ? situationFamille.creationDate.toJSON() : undefined,
      updatedDate: situationFamille.updatedDate?.isValid() ? situationFamille.updatedDate.toJSON() : undefined,
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
      res.body.forEach((situationFamille: ISituationFamille) => {
        situationFamille.creationDate = situationFamille.creationDate ? dayjs(situationFamille.creationDate) : undefined;
        situationFamille.updatedDate = situationFamille.updatedDate ? dayjs(situationFamille.updatedDate) : undefined;
      });
    }
    return res;
  }
}
