import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { baseUrlJHipsterApi } from 'src/environments/environment';
import { getRessourceStatsLectureVideoIdentifier, IRessourceStatsLectureVideo } from './ressource-stats-lecture-video.model';
import { createRequestOption, isPresent } from 'src/@ekbz/services/utils';

export type EntityResponseType = HttpResponse<IRessourceStatsLectureVideo>;
export type EntityArrayResponseType = HttpResponse<IRessourceStatsLectureVideo[]>;

@Injectable({ providedIn: 'root' })
export class RessourceStatsLectureVideoService {
    public resourceUrl = baseUrlJHipsterApi + 'api/ressource-stats-lecture-videos';


  constructor(protected http: HttpClient) {}

  create(ressourceStatsLectureVideo: IRessourceStatsLectureVideo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ressourceStatsLectureVideo);
    return this.http
      .post<IRessourceStatsLectureVideo>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(ressourceStatsLectureVideo: IRessourceStatsLectureVideo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ressourceStatsLectureVideo);
    return this.http
      .put<IRessourceStatsLectureVideo>(
        `${this.resourceUrl}/${getRessourceStatsLectureVideoIdentifier(ressourceStatsLectureVideo) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(ressourceStatsLectureVideo: IRessourceStatsLectureVideo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ressourceStatsLectureVideo);
    return this.http
      .patch<IRessourceStatsLectureVideo>(
        `${this.resourceUrl}/${getRessourceStatsLectureVideoIdentifier(ressourceStatsLectureVideo) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IRessourceStatsLectureVideo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRessourceStatsLectureVideo[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRessourceStatsLectureVideoToCollectionIfMissing(
    ressourceStatsLectureVideoCollection: IRessourceStatsLectureVideo[],
    ...ressourceStatsLectureVideosToCheck: (IRessourceStatsLectureVideo | null | undefined)[]
  ): IRessourceStatsLectureVideo[] {
    const ressourceStatsLectureVideos: IRessourceStatsLectureVideo[] = ressourceStatsLectureVideosToCheck.filter(isPresent);
    if (ressourceStatsLectureVideos.length > 0) {
      const ressourceStatsLectureVideoCollectionIdentifiers = ressourceStatsLectureVideoCollection.map(
        ressourceStatsLectureVideoItem => getRessourceStatsLectureVideoIdentifier(ressourceStatsLectureVideoItem)!
      );
      const ressourceStatsLectureVideosToAdd = ressourceStatsLectureVideos.filter(ressourceStatsLectureVideoItem => {
        const ressourceStatsLectureVideoIdentifier = getRessourceStatsLectureVideoIdentifier(ressourceStatsLectureVideoItem);
        if (
          ressourceStatsLectureVideoIdentifier == null ||
          ressourceStatsLectureVideoCollectionIdentifiers.includes(ressourceStatsLectureVideoIdentifier)
        ) {
          return false;
        }
        ressourceStatsLectureVideoCollectionIdentifiers.push(ressourceStatsLectureVideoIdentifier);
        return true;
      });
      return [...ressourceStatsLectureVideosToAdd, ...ressourceStatsLectureVideoCollection];
    }
    return ressourceStatsLectureVideoCollection;
  }

  protected convertDateFromClient(ressourceStatsLectureVideo: IRessourceStatsLectureVideo): IRessourceStatsLectureVideo {
    return Object.assign({}, ressourceStatsLectureVideo, {
      creationDate: ressourceStatsLectureVideo.creationDate?.isValid() ? ressourceStatsLectureVideo.creationDate.toJSON() : undefined,
      updatedDate: ressourceStatsLectureVideo.updatedDate?.isValid() ? ressourceStatsLectureVideo.updatedDate.toJSON() : undefined,
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
      res.body.forEach((ressourceStatsLectureVideo: IRessourceStatsLectureVideo) => {
        ressourceStatsLectureVideo.creationDate = ressourceStatsLectureVideo.creationDate
          ? dayjs(ressourceStatsLectureVideo.creationDate)
          : undefined;
        ressourceStatsLectureVideo.updatedDate = ressourceStatsLectureVideo.updatedDate
          ? dayjs(ressourceStatsLectureVideo.updatedDate)
          : undefined;
      });
    }
    return res;
  }
}
