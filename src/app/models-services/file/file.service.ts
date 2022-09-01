import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { baseUrlJHipsterApi } from 'src/environments/environment';
import { getFileIdentifier, IFile } from './file.model';
import { createRequestOption, isPresent } from 'src/@ekbz/services/utils';

export type EntityResponseType = HttpResponse<IFile>;
export type EntityArrayResponseType = HttpResponse<IFile[]>;

@Injectable({ providedIn: 'root' })
export class FileService {
  public resourceUrl = baseUrlJHipsterApi + 'api/files';
  public resourceUrlPublic = baseUrlJHipsterApi + 'api/extendedPublic/files';

  constructor(protected http: HttpClient) {}

  create(file: IFile): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(file);
    return this.http
      .post<IFile>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(file: IFile): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(file);
    return this.http
      .put<IFile>(`${this.resourceUrl}/${getFileIdentifier(file) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(file: IFile): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(file);
    return this.http
      .patch<IFile>(`${this.resourceUrl}/${getFileIdentifier(file) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IFile>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFile[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFileToCollectionIfMissing(fileCollection: IFile[], ...filesToCheck: (IFile | null | undefined)[]): IFile[] {
    const files: IFile[] = filesToCheck.filter(isPresent);
    if (files.length > 0) {
      const fileCollectionIdentifiers = fileCollection.map(fileItem => getFileIdentifier(fileItem)!);
      const filesToAdd = files.filter(fileItem => {
        const fileIdentifier = getFileIdentifier(fileItem);
        if (fileIdentifier == null || fileCollectionIdentifiers.includes(fileIdentifier)) {
          return false;
        }
        fileCollectionIdentifiers.push(fileIdentifier);
        return true;
      });
      return [...filesToAdd, ...fileCollection];
    }
    return fileCollection;
  }

  protected convertDateFromClient(file: IFile): IFile {
    return Object.assign({}, file, {
      creationDate: file.creationDate?.isValid() ? file.creationDate.toJSON() : undefined,
      updatedDate: file.updatedDate?.isValid() ? file.updatedDate.toJSON() : undefined,
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
      res.body.forEach((file: IFile) => {
        file.creationDate = file.creationDate ? dayjs(file.creationDate) : undefined;
        file.updatedDate = file.updatedDate ? dayjs(file.updatedDate) : undefined;
      });
    }
    return res;
  }
}
