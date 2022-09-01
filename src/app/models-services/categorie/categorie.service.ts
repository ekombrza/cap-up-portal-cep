import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { baseUrlJHipsterApi } from 'src/environments/environment';
import { getCategorieIdentifier, ICategorie } from './categorie.model';
import { createRequestOption, isPresent } from 'src/@ekbz/services/utils';

export type EntityResponseType = HttpResponse<ICategorie>;
export type EntityArrayResponseType = HttpResponse<ICategorie[]>;

@Injectable({ providedIn: 'root' })
export class CategorieService {
  public resourceUrl = baseUrlJHipsterApi + 'api/categories';
  public resourceUrlExtendedCat4ressources = baseUrlJHipsterApi + 'api/extended/categoriesWithFourResources';
  public resourceUrlPublic = baseUrlJHipsterApi + 'api/extendedPublic/categories';

  constructor(protected http: HttpClient) {}

  create(categorie: ICategorie): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(categorie);
    return this.http
      .post<ICategorie>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(categorie: ICategorie): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(categorie);
    return this.http
      .put<ICategorie>(`${this.resourceUrl}/${getCategorieIdentifier(categorie) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(categorie: ICategorie): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(categorie);
    return this.http
      .patch<ICategorie>(`${this.resourceUrl}/${getCategorieIdentifier(categorie) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICategorie>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICategorie[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCategoriesWithFourResources(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategorie[]>(this.resourceUrlExtendedCat4ressources, { params: options, observe: 'response' })
    .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  addCategorieToCollectionIfMissing(
    categorieCollection: ICategorie[],
    ...categoriesToCheck: (ICategorie | null | undefined)[]
  ): ICategorie[] {
    const categories: ICategorie[] = categoriesToCheck.filter(isPresent);
    if (categories.length > 0) {
      const categorieCollectionIdentifiers = categorieCollection.map(categorieItem => getCategorieIdentifier(categorieItem)!);
      const categoriesToAdd = categories.filter(categorieItem => {
        const categorieIdentifier = getCategorieIdentifier(categorieItem);
        if (categorieIdentifier == null || categorieCollectionIdentifiers.includes(categorieIdentifier)) {
          return false;
        }
        categorieCollectionIdentifiers.push(categorieIdentifier);
        return true;
      });
      return [...categoriesToAdd, ...categorieCollection];
    }
    return categorieCollection;
  }

  protected convertDateFromClient(categorie: ICategorie): ICategorie {
    return Object.assign({}, categorie, {
      creationDate: categorie.creationDate?.isValid() ? categorie.creationDate.toJSON() : undefined,
      updatedDate: categorie.updatedDate?.isValid() ? categorie.updatedDate.toJSON() : undefined,
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
      res.body.forEach((categorie: ICategorie) => {
        categorie.creationDate = categorie.creationDate ? dayjs(categorie.creationDate) : undefined;
        categorie.updatedDate = categorie.updatedDate ? dayjs(categorie.updatedDate) : undefined;
      });
    }
    return res;
  }
}
