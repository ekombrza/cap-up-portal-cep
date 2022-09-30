import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { getTypeAdhesionIdentifier, ITypeAdhesion, TypeAdhesion } from './type-adhesion.model';
import { createRequestOption, isPresent } from 'src/@ekbz/services/utils';
import { baseUrlJHipsterApi } from 'src/environments/environment';

export type EntityResponseType = HttpResponse<ITypeAdhesion>;
export type EntityArrayResponseType = HttpResponse<ITypeAdhesion[]>;

@Injectable({ providedIn: 'root' })
export class TypeAdhesionService {
  
    public baseUrlExtended = baseUrlJHipsterApi + 'api/extended/type-adhesions';
    public baseUrl = baseUrlJHipsterApi + 'api/type-adhesions';

    private _typesAdhesion: BehaviorSubject<TypeAdhesion[] | null> = new BehaviorSubject(null);

  constructor(protected http: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for membre
     */
     get typesAdhesion$(): Observable<TypeAdhesion[]>
     {
         return this._typesAdhesion.asObservable();
     }
 
     // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get membres
     */
    getTypesAdhesion(req?: any): Observable<TypeAdhesion[]>
    {
        const options = createRequestOption(req);
        return this.http.get<TypeAdhesion[]>(this.baseUrl, { params: options}).pipe(
            tap((typesAdhesion) => {
                this._typesAdhesion.next(typesAdhesion);
            })
        );
    }

  create(typeAdhesion: ITypeAdhesion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(typeAdhesion);
    return this.http
      .post<ITypeAdhesion>(this.baseUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(typeAdhesion: ITypeAdhesion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(typeAdhesion);
    return this.http
      .put<ITypeAdhesion>(`${this.baseUrl}/${getTypeAdhesionIdentifier(typeAdhesion) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(typeAdhesion: ITypeAdhesion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(typeAdhesion);
    return this.http
      .patch<ITypeAdhesion>(`${this.baseUrl}/${getTypeAdhesionIdentifier(typeAdhesion) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITypeAdhesion>(`${this.baseUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITypeAdhesion[]>(this.baseUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.baseUrl}/${id}`, { observe: 'response' });
  }

  addTypeAdhesionToCollectionIfMissing(
    typeAdhesionCollection: ITypeAdhesion[],
    ...typeAdhesionsToCheck: (ITypeAdhesion | null | undefined)[]
  ): ITypeAdhesion[] {
    const typeAdhesions: ITypeAdhesion[] = typeAdhesionsToCheck.filter(isPresent);
    if (typeAdhesions.length > 0) {
      const typeAdhesionCollectionIdentifiers = typeAdhesionCollection.map(
        typeAdhesionItem => getTypeAdhesionIdentifier(typeAdhesionItem)!
      );
      const typeAdhesionsToAdd = typeAdhesions.filter(typeAdhesionItem => {
        const typeAdhesionIdentifier = getTypeAdhesionIdentifier(typeAdhesionItem);
        if (typeAdhesionIdentifier == null || typeAdhesionCollectionIdentifiers.includes(typeAdhesionIdentifier)) {
          return false;
        }
        typeAdhesionCollectionIdentifiers.push(typeAdhesionIdentifier);
        return true;
      });
      return [...typeAdhesionsToAdd, ...typeAdhesionCollection];
    }
    return typeAdhesionCollection;
  }

  protected convertDateFromClient(typeAdhesion: ITypeAdhesion): ITypeAdhesion {
    return Object.assign({}, typeAdhesion, {
      creationDate: typeAdhesion.creationDate?.isValid() ? typeAdhesion.creationDate.toJSON() : undefined,
      updatedDate: typeAdhesion.updatedDate?.isValid() ? typeAdhesion.updatedDate.toJSON() : undefined,
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
      res.body.forEach((typeAdhesion: ITypeAdhesion) => {
        typeAdhesion.creationDate = typeAdhesion.creationDate ? dayjs(typeAdhesion.creationDate) : undefined;
        typeAdhesion.updatedDate = typeAdhesion.updatedDate ? dayjs(typeAdhesion.updatedDate) : undefined;
      });
    }
    return res;
  }
}
