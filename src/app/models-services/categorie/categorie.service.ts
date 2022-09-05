import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { baseUrlJHipsterApi } from 'src/environments/environment';
import { Categorie, CategoriePagination, getCategorieIdentifier, ICategorie } from './categorie.model';
import { createRequestOption, isPresent } from 'src/@ekbz/services/utils';
import { TypeResourceEnum } from '../ressource/type-resource-enum.model';

export type EntityResponseType = HttpResponse<ICategorie>;
export type EntityArrayResponseType = HttpResponse<ICategorie[]>;

@Injectable({ providedIn: 'root' })
export class CategorieService {
  public resourceUrl = baseUrlJHipsterApi + 'api/categories';
  public resourceUrlExtended = baseUrlJHipsterApi + 'api/extended/';
 // public resourceUrlExtendedCat4ressources = baseUrlJHipsterApi + 'api/extended/categoriesWithFourResources';
  public resourceUrlPublic = baseUrlJHipsterApi + 'api/extendedPublic/categories';

  private _pagination: BehaviorSubject<CategoriePagination | null> = new BehaviorSubject(null);
  private _categories: BehaviorSubject<Categorie[] | null> = new BehaviorSubject(null);
  private _categorie: BehaviorSubject<Categorie | null> = new BehaviorSubject(null);

  constructor(protected http: HttpClient) {}


  /**
   * Getter for categories
   */
  get categories$(): Observable<Categorie[]>
  {
      return this._categories.asObservable();
  }

  /**
   * Getter for categorie
   */
    get categorie$(): Observable<Categorie>
    {
        return this._categorie.asObservable();
    }

    /**
     * Getter for pagination
     */
     get pagination$(): Observable<CategoriePagination>
     {
         return this._pagination.asObservable();
     }

  /**
   * Get categories
   *
   *
   * @param page
   * @param size
   * @param sort
   * @param order
   * @param search
   */
    getCategories(req?: any):Observable<Categorie[]>
  {
    const options = createRequestOption(req);
    return this.http
        .get<ICategorie[]>(this.resourceUrlExtended + 'categories', {  params: options,observe: 'response' })
        .pipe(
          map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)),
          map((res)=> res.body),
          tap((response) => {
            this._categories.next(response);
            //this._pagination.next(response.pagination);
          })
        );
 }

 /**
     * Get categorie by id
     */
  getCategorieById(id: number): Observable<Categorie>
  {
      return this._categories.pipe(
          take(1),
          map((categories) => {

              // Find the categorie
              const categorie = categories.find(item => item.id === id) || null;

              // Update the categorie
              this._categorie.next(categorie);

              // Return the categorie
              return categorie;
          }),
          switchMap((categorie) => {

              if ( !categorie )
              {
                  return throwError('Could not found categorie with id of ' + id + '!');
              }

              return of(categorie);
          })
      );
  }

  /**
     * Create categorie
     */
   createCategorie(): Observable<Categorie>
   {
      let categorie = new Categorie();
      categorie.name = 'nouvelle catégorie';
      categorie.typeResourceEnum = TypeResourceEnum.COURS;
      categorie.creationDate = dayjs();
      categorie.updatedDate = dayjs();
       return this.categories$.pipe(
           take(1),
           switchMap(categories => this.http.post<Categorie>(this.resourceUrl, categorie).pipe(
               map((newCategorie) => {

                   // Update the categories with the new categorie
                   this._categories.next([newCategorie, ...categories]);

                   // Return the new categorie
                   return newCategorie;
               })
           ))
       );
   }

   /**
     * Update categorie
     *
     * @param id
     * @param categorie
     */
    updateCategorie(id: number, categorie: Categorie): Observable<Categorie>
    {
        return this.categories$.pipe(
            take(1),
            switchMap(categories => this.http.patch<Categorie>(this.resourceUrl + '/' + id, 
                categorie
            ).pipe(
                map((updatedCategorie) => {

                    // Find the index of the updated categorie
                    const index = categories.findIndex(item => item.id === id);

                    // Update the categorie
                    categories[index] = updatedCategorie;

                    // Update the categories
                    this._categories.next(categories);

                    // Return the updated categorie
                    return updatedCategorie;
                }),
                switchMap(updatedCategorie => this.categorie$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the categorie if it's selected
                        this._categorie.next(updatedCategorie);

                        // Return the updated categorie
                        return updatedCategorie;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the categorie
     *
     * @param id
     */
     deleteCategorie(id: number): Observable<boolean>
     {
         return this.categories$.pipe(
             take(1),
             switchMap(categories => this.http.delete(this.resourceUrl + '/' +id).pipe(
                 map((isDeleted: boolean) => {
 
                     // Find the index of the deleted categorie
                     const index = categories.findIndex(item => item.id === id);
 
                     // Delete the categorie
                    categories.splice(index, 1);
 
                     // Update the categories
                     this._categories.next(categories);
 
                     // Return the deleted status
                     return isDeleted;
                 })
             ))
         );
     }

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
    return this.http.get<ICategorie[]>(this.resourceUrlExtended + 'categoriesWithFourResources', { params: options, observe: 'response' })
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
