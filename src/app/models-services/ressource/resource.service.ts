import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';


import { baseUrlJHipsterApi } from 'src/environments/environment';
import { getResourceIdentifier, IResource } from './resource.model';
import { createRequestOption, isPresent } from 'src/@ekbz/services/utils';

export type EntityResponseType = HttpResponse<IResource>;
export type EntityArrayResponseType = HttpResponse<IResource[]>;

@Injectable({ providedIn: 'root' })
export class ResourceService {
  public resourceUrl = baseUrlJHipsterApi + 'api/resources';
  public resourceUrlExtended = baseUrlJHipsterApi + 'api/extended/resources';

  constructor(protected http: HttpClient) {}

  create(resource: IResource): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(resource);
    return this.http
      .post<IResource>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(resource: IResource): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(resource);
    return this.http
      .put<IResource>(`${this.resourceUrl}/${getResourceIdentifier(resource) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(resource: IResource): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(resource);
    return this.http
      .patch<IResource>(`${this.resourceUrl}/${getResourceIdentifier(resource) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IResource>(`${this.resourceUrlExtended}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IResource[]>(this.resourceUrlExtended, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  getNbTotalVideos(idRessource){
    return this.http
      .get<any>(this.resourceUrlExtended + '/' + idRessource + '/count-video');
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addResourceToCollectionIfMissing(resourceCollection: IResource[], ...resourcesToCheck: (IResource | null | undefined)[]): IResource[] {
    const resources: IResource[] = resourcesToCheck.filter(isPresent);
    if (resources.length > 0) {
      const resourceCollectionIdentifiers = resourceCollection.map(resourceItem => getResourceIdentifier(resourceItem)!);
      const resourcesToAdd = resources.filter(resourceItem => {
        const resourceIdentifier = getResourceIdentifier(resourceItem);
        if (resourceIdentifier == null || resourceCollectionIdentifiers.includes(resourceIdentifier)) {
          return false;
        }
        resourceCollectionIdentifiers.push(resourceIdentifier);
        return true;
      });
      return [...resourcesToAdd, ...resourceCollection];
    }
    return resourceCollection;
  }

  protected convertDateFromClient(resource: IResource): IResource {
    return Object.assign({}, resource, {
      creationDate: resource.creationDate?.isValid() ? resource.creationDate.toJSON() : undefined,
      updatedDate: resource.updatedDate?.isValid() ? resource.updatedDate.toJSON() : undefined,
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
      res.body.forEach((resource: IResource) => {
        resource.creationDate = resource.creationDate ? dayjs(resource.creationDate) : undefined;
        resource.updatedDate = resource.updatedDate ? dayjs(resource.updatedDate) : undefined;
      });
    }
    return res;
  }
}
