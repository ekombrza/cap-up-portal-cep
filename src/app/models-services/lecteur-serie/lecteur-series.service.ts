import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';


import { baseUrlJHipsterApi } from 'src/environments/environment';
import { getLecteurSeriesIdentifier, ILecteurSeries } from './lecteur-series.model';
import { createRequestOption, isPresent } from 'src/@ekbz/services/utils';

export type EntityResponseType = HttpResponse<ILecteurSeries>;
export type EntityArrayResponseType = HttpResponse<ILecteurSeries[]>;

@Injectable({ providedIn: 'root' })
export class LecteurSeriesService {
  public resourceUrl = baseUrlJHipsterApi + 'api/lecteur-series';
  public resourceUrlPublic = baseUrlJHipsterApi + 'api/extendedPublic/lecteur-series';

  constructor(protected http: HttpClient) {}

  create(lecteurSeries: ILecteurSeries): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(lecteurSeries);
    return this.http
      .post<ILecteurSeries>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(lecteurSeries: ILecteurSeries): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(lecteurSeries);
    return this.http
      .put<ILecteurSeries>(`${this.resourceUrl}/${getLecteurSeriesIdentifier(lecteurSeries) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(lecteurSeries: ILecteurSeries): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(lecteurSeries);
    return this.http
      .patch<ILecteurSeries>(`${this.resourceUrl}/${getLecteurSeriesIdentifier(lecteurSeries) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ILecteurSeries>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILecteurSeries[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLecteurSeriesToCollectionIfMissing(
    lecteurSeriesCollection: ILecteurSeries[],
    ...lecteurSeriesToCheck: (ILecteurSeries | null | undefined)[]
  ): ILecteurSeries[] {
    const lecteurSeries: ILecteurSeries[] = lecteurSeriesToCheck.filter(isPresent);
    if (lecteurSeries.length > 0) {
      const lecteurSeriesCollectionIdentifiers = lecteurSeriesCollection.map(
        lecteurSeriesItem => getLecteurSeriesIdentifier(lecteurSeriesItem)!
      );
      const lecteurSeriesToAdd = lecteurSeries.filter(lecteurSeriesItem => {
        const lecteurSeriesIdentifier = getLecteurSeriesIdentifier(lecteurSeriesItem);
        if (lecteurSeriesIdentifier == null || lecteurSeriesCollectionIdentifiers.includes(lecteurSeriesIdentifier)) {
          return false;
        }
        lecteurSeriesCollectionIdentifiers.push(lecteurSeriesIdentifier);
        return true;
      });
      return [...lecteurSeriesToAdd, ...lecteurSeriesCollection];
    }
    return lecteurSeriesCollection;
  }

  protected convertDateFromClient(lecteurSeries: ILecteurSeries): ILecteurSeries {
    return Object.assign({}, lecteurSeries, {
      creationDate: lecteurSeries.creationDate?.isValid() ? lecteurSeries.creationDate.toJSON() : undefined,
      updatedDate: lecteurSeries.updatedDate?.isValid() ? lecteurSeries.updatedDate.toJSON() : undefined,
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
      res.body.forEach((lecteurSeries: ILecteurSeries) => {
        lecteurSeries.creationDate = lecteurSeries.creationDate ? dayjs(lecteurSeries.creationDate) : undefined;
        lecteurSeries.updatedDate = lecteurSeries.updatedDate ? dayjs(lecteurSeries.updatedDate) : undefined;
      });
    }
    return res;
  }
}
