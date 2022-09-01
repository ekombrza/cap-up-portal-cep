import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';


import { baseUrlJHipsterApi } from 'src/environments/environment';
import { getSectionResourceIdentifier, ISectionResource } from './section-resource.model';
import { createRequestOption, isPresent } from 'src/@ekbz/services/utils';

export type EntityResponseType = HttpResponse<ISectionResource>;
export type EntityArrayResponseType = HttpResponse<ISectionResource[]>;

@Injectable({ providedIn: 'root' })
export class SectionResourceService {
    public resourceUrl = baseUrlJHipsterApi + 'api/section-resources';
    public resourceUrlExtended = baseUrlJHipsterApi + 'api/extended/section-resources';

  constructor(protected http: HttpClient) {}

  create(sectionResource: ISectionResource): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sectionResource);
    return this.http
      .post<ISectionResource>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(sectionResource: ISectionResource): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sectionResource);
    return this.http
      .put<ISectionResource>(`${this.resourceUrl}/${getSectionResourceIdentifier(sectionResource) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(sectionResource: ISectionResource): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sectionResource);
    return this.http
      .patch<ISectionResource>(`${this.resourceUrl}/${getSectionResourceIdentifier(sectionResource) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISectionResource>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISectionResource[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSectionResourceToCollectionIfMissing(
    sectionResourceCollection: ISectionResource[],
    ...sectionResourcesToCheck: (ISectionResource | null | undefined)[]
  ): ISectionResource[] {
    const sectionResources: ISectionResource[] = sectionResourcesToCheck.filter(isPresent);
    if (sectionResources.length > 0) {
      const sectionResourceCollectionIdentifiers = sectionResourceCollection.map(
        sectionResourceItem => getSectionResourceIdentifier(sectionResourceItem)!
      );
      const sectionResourcesToAdd = sectionResources.filter(sectionResourceItem => {
        const sectionResourceIdentifier = getSectionResourceIdentifier(sectionResourceItem);
        if (sectionResourceIdentifier == null || sectionResourceCollectionIdentifiers.includes(sectionResourceIdentifier)) {
          return false;
        }
        sectionResourceCollectionIdentifiers.push(sectionResourceIdentifier);
        return true;
      });
      return [...sectionResourcesToAdd, ...sectionResourceCollection];
    }
    return sectionResourceCollection;
  }

  protected convertDateFromClient(sectionResource: ISectionResource): ISectionResource {
    return Object.assign({}, sectionResource, {
      creationDate: sectionResource.creationDate?.isValid() ? sectionResource.creationDate.toJSON() : undefined,
      updatedDate: sectionResource.updatedDate?.isValid() ? sectionResource.updatedDate.toJSON() : undefined,
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
      res.body.forEach((sectionResource: ISectionResource) => {
        sectionResource.creationDate = sectionResource.creationDate ? dayjs(sectionResource.creationDate) : undefined;
        sectionResource.updatedDate = sectionResource.updatedDate ? dayjs(sectionResource.updatedDate) : undefined;
      });
    }
    return res;
  }
}
