import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { baseUrlJHipsterApi } from 'src/environments/environment';
import { getTypeFileIdentifier, ITypeFile, TypeFile, TypefilePagination } from './type-file.model';
import { createRequestOption, isPresent } from 'src/@ekbz/services/utils';

export type EntityResponseType = HttpResponse<ITypeFile>;
export type EntityArrayResponseType = HttpResponse<ITypeFile[]>;

@Injectable({ providedIn: 'root' })
export class TypeFileService {
  public resourceUrl = baseUrlJHipsterApi + 'api/type-files';
  public resourceUrlExtended = baseUrlJHipsterApi + 'api/extended/type-files';

  private _pagination: BehaviorSubject<TypefilePagination | null> = new BehaviorSubject(null);
  private _typeFiles: BehaviorSubject<TypeFile[] | null> = new BehaviorSubject(null);
  private _typeFile: BehaviorSubject<TypeFile | null> = new BehaviorSubject(null);

  constructor(protected http: HttpClient) {}

  /**
   * Getter for typeFiles
   */
   get typeFiles$(): Observable<TypeFile[]>
   {
       return this._typeFiles.asObservable();
   }
 
   /**
    * Getter for typeFile
    */
     get typeFile$(): Observable<TypeFile>
     {
         return this._typeFile.asObservable();
     }
 
     /**
      * Getter for pagination
      */
      get pagination$(): Observable<TypefilePagination>
      {
          return this._pagination.asObservable();
      }
 
   /**
    * Get typeFiles
    *
    *
    * @param page
    * @param size
    * @param sort
    * @param order
    * @param search
    */
     getTypeFiles(req?: any):Observable<TypeFile[]>
   {
     const options = createRequestOption(req);
     return this.http
         .get<ITypeFile[]>(`${this.resourceUrlExtended}/typeFilesPageable`, {  params: options,observe: 'response' })
         .pipe(
           map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)),
           map((res)=> res.body),
           tap((response) => {
             this._typeFiles.next(response);
             //this._pagination.next(response.pagination);
           })
         );
  }
 
  /**
      * Get typeFile by id
      */
   getTypeFileById(id: number): Observable<TypeFile>
   {
       return this._typeFiles.pipe(
           take(1),
           map((typeFiles) => {
 
               // Find the typeFile
               const typeFile = typeFiles.find(item => item.id === id) || null;
 
               // Update the typeFile
               this._typeFile.next(typeFile);
 
               // Return the typeFile
               return typeFile;
           }),
           switchMap((typeFile) => {
 
               if ( !typeFile )
               {
                   return throwError('Could not found typeFile with id of ' + id + '!');
               }
 
               return of(typeFile);
           })
       );
   }
 
   /**
      * Create typeFile
      */
    createTypeFile(): Observable<TypeFile>
    {
       let typeFile = new TypeFile();
       typeFile.name = 'nouveau type de fichier';
       typeFile.creationDate = dayjs();
       typeFile.updatedDate = dayjs();
        return this.typeFiles$.pipe(
            take(1),
            switchMap(typeFiles => this.http.post<TypeFile>(this.resourceUrl, typeFile).pipe(
                map((newTypeFile) => {
 
                    // Update the typeFiles with the new typeFile
                    this._typeFiles.next([newTypeFile, ...typeFiles]);
 
                    // Return the new typeFile
                    return newTypeFile;
                })
            ))
        );
    }
 
    /**
      * Update typeFile
      *
      * @param id
      * @param typeFile
      */
     updateTypeFile(id: number, typeFile: TypeFile): Observable<TypeFile>
     {
         return this.typeFiles$.pipe(
             take(1),
             switchMap(typeFiles => this.http.patch<TypeFile>(this.resourceUrl + '/' + id, 
                 typeFile
             ).pipe(
                 map((updatedTypeFile) => {
 
                     // Find the index of the updated typeFile
                     const index = typeFiles.findIndex(item => item.id === id);
 
                     // Update the typeFile
                     typeFiles[index] = updatedTypeFile;
 
                     // Update the typeFiles
                     this._typeFiles.next(typeFiles);
 
                     // Return the updated typeFile
                     return updatedTypeFile;
                 }),
                 switchMap(updatedTypeFile => this.typeFile$.pipe(
                     take(1),
                     filter(item => item && item.id === id),
                     tap(() => {
 
                         // Update the typeFile if it's selected
                         this._typeFile.next(updatedTypeFile);
 
                         // Return the updated typeFile
                         return updatedTypeFile;
                     })
                 ))
             ))
         );
     }
 
     /**
      * Delete the typeFile
      *
      * @param id
      */
      deleteTypeFile(id: number): Observable<boolean>
      {
          return this.typeFiles$.pipe(
              take(1),
              switchMap(typeFiles => this.http.delete(this.resourceUrl + '/' +id).pipe(
                  map((isDeleted: boolean) => {
  
                      // Find the index of the deleted typeFile
                      const index = typeFiles.findIndex(item => item.id === id);
  
                      // Delete the typeFile
                     typeFiles.splice(index, 1);
  
                      // Update the typeFiles
                      this._typeFiles.next(typeFiles);
  
                      // Return the deleted status
                      return isDeleted;
                  })
              ))
          );
      }

  create(typeFile: ITypeFile): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(typeFile);
    return this.http
      .post<ITypeFile>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(typeFile: ITypeFile): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(typeFile);
    return this.http
      .put<ITypeFile>(`${this.resourceUrl}/${getTypeFileIdentifier(typeFile) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(typeFile: ITypeFile): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(typeFile);
    return this.http
      .patch<ITypeFile>(`${this.resourceUrl}/${getTypeFileIdentifier(typeFile) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITypeFile>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITypeFile[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTypeFileToCollectionIfMissing(typeFileCollection: ITypeFile[], ...typeFilesToCheck: (ITypeFile | null | undefined)[]): ITypeFile[] {
    const typeFiles: ITypeFile[] = typeFilesToCheck.filter(isPresent);
    if (typeFiles.length > 0) {
      const typeFileCollectionIdentifiers = typeFileCollection.map(typeFileItem => getTypeFileIdentifier(typeFileItem)!);
      const typeFilesToAdd = typeFiles.filter(typeFileItem => {
        const typeFileIdentifier = getTypeFileIdentifier(typeFileItem);
        if (typeFileIdentifier == null || typeFileCollectionIdentifiers.includes(typeFileIdentifier)) {
          return false;
        }
        typeFileCollectionIdentifiers.push(typeFileIdentifier);
        return true;
      });
      return [...typeFilesToAdd, ...typeFileCollection];
    }
    return typeFileCollection;
  }

  protected convertDateFromClient(typeFile: ITypeFile): ITypeFile {
    return Object.assign({}, typeFile, {
      creationDate: typeFile.creationDate?.isValid() ? typeFile.creationDate.toJSON() : undefined,
      updatedDate: typeFile.updatedDate?.isValid() ? typeFile.updatedDate.toJSON() : undefined,
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
      res.body.forEach((typeFile: ITypeFile) => {
        typeFile.creationDate = typeFile.creationDate ? dayjs(typeFile.creationDate) : undefined;
        typeFile.updatedDate = typeFile.updatedDate ? dayjs(typeFile.updatedDate) : undefined;
      });
    }
    return res;
  }
}
