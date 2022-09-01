import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { baseUrlJHipsterApi } from 'src/environments/environment';
import { ApplicationData, getApplicationDataIdentifier, IApplicationData } from './application-data.model';
import { createRequestOption, isPresent } from 'src/@ekbz/services/utils';

export type EntityResponseType = HttpResponse<IApplicationData>;
export type EntityArrayResponseType = HttpResponse<IApplicationData[]>;

@Injectable({ providedIn: 'root' })
export class ApplicationDataService {
  public resourceUrl = baseUrlJHipsterApi + 'api/application-data';
  public resourceUrlPublic = baseUrlJHipsterApi + 'api/extendedPublic/application-data';

  private applicationDataObs$: BehaviorSubject<ApplicationData> = new BehaviorSubject(null);

  constructor(protected http: HttpClient) {}

  getApplicatioNDataObs(applicationResourceId, membreId, callIfNull: boolean): Observable<ApplicationData> {
    if(this.applicationDataObs$.value == null && callIfNull){
      this.query({'applicationId.equals':applicationResourceId, 'membreId.equals': membreId})
      .pipe(map(result => result.body[0]))
      .subscribe((appData) => {
        this.setApplicationDataObs(appData);
      });
    }
    return this.applicationDataObs$.asObservable();
  }

  setApplicationDataObs(applicatioNData: ApplicationData) {
    this.applicationDataObs$.next(applicatioNData);
  }

  create(applicationData: IApplicationData): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(applicationData);
    return this.http
      .post<IApplicationData>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(applicationData: IApplicationData): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(applicationData);
    return this.http
      .put<IApplicationData>(`${this.resourceUrl}/${getApplicationDataIdentifier(applicationData) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(applicationData: IApplicationData): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(applicationData);
    return this.http
      .patch<IApplicationData>(`${this.resourceUrl}/${getApplicationDataIdentifier(applicationData) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IApplicationData>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IApplicationData[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addApplicationDataToCollectionIfMissing(
    applicationDataCollection: IApplicationData[],
    ...applicationDataToCheck: (IApplicationData | null | undefined)[]
  ): IApplicationData[] {
    const applicationData: IApplicationData[] = applicationDataToCheck.filter(isPresent);
    if (applicationData.length > 0) {
      const applicationDataCollectionIdentifiers = applicationDataCollection.map(
        applicationDataItem => getApplicationDataIdentifier(applicationDataItem)!
      );
      const applicationDataToAdd = applicationData.filter(applicationDataItem => {
        const applicationDataIdentifier = getApplicationDataIdentifier(applicationDataItem);
        if (applicationDataIdentifier == null || applicationDataCollectionIdentifiers.includes(applicationDataIdentifier)) {
          return false;
        }
        applicationDataCollectionIdentifiers.push(applicationDataIdentifier);
        return true;
      });
      return [...applicationDataToAdd, ...applicationDataCollection];
    }
    return applicationDataCollection;
  }

  protected convertDateFromClient(applicationData: IApplicationData): IApplicationData {
    return Object.assign({}, applicationData, {
      creationDate: applicationData.creationDate?.isValid() ? applicationData.creationDate.toJSON() : undefined,
      updatedDate: applicationData.updatedDate?.isValid() ? applicationData.updatedDate.toJSON() : undefined,
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
      res.body.forEach((applicationData: IApplicationData) => {
        applicationData.creationDate = applicationData.creationDate ? dayjs(applicationData.creationDate) : undefined;
        applicationData.updatedDate = applicationData.updatedDate ? dayjs(applicationData.updatedDate) : undefined;
      });
    }
    return res;
  }
}
