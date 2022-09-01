import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { baseUrlJHipsterApi } from 'src/environments/environment';
import { getTypeFileIdentifier, ITypeFile } from './type-file.model';
import { createRequestOption, isPresent } from 'src/@ekbz/services/utils';

export type EntityResponseType = HttpResponse<ITypeFile>;
export type EntityArrayResponseType = HttpResponse<ITypeFile[]>;

@Injectable({ providedIn: 'root' })
export class TypeFileService {
  public resourceUrl = baseUrlJHipsterApi + 'api/type-files';
  public resourceUrlExtended = baseUrlJHipsterApi + 'api/extended/type-files';

  constructor(protected http: HttpClient) {}

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
