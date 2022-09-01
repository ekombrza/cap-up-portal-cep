import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { baseUrlJHipsterApi } from 'src/environments/environment';
import { createRequestOption, isPresent } from 'src/@ekbz/services/utils';
import { getRoleIdentifier, IRole } from './role.model';

export type EntityResponseType = HttpResponse<IRole>;
export type EntityArrayResponseType = HttpResponse<IRole[]>;

@Injectable({ providedIn: 'root' })
export class RoleService {
  public resourceUrl = baseUrlJHipsterApi + 'api/roles';
  public resourceUrlExtendedPublic = baseUrlJHipsterApi + 'api/extendedPublic/roles';

  constructor(protected http: HttpClient) {}

  create(role: IRole): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(role);
    return this.http
      .post<IRole>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(role: IRole): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(role);
    return this.http
      .put<IRole>(`${this.resourceUrl}/${getRoleIdentifier(role) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(role: IRole): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(role);
    return this.http
      .patch<IRole>(`${this.resourceUrl}/${getRoleIdentifier(role) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IRole>(`${this.resourceUrlExtendedPublic}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRole[]>(this.resourceUrlExtendedPublic, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRoleToCollectionIfMissing(roleCollection: IRole[], ...rolesToCheck: (IRole | null | undefined)[]): IRole[] {
    const roles: IRole[] = rolesToCheck.filter(isPresent);
    if (roles.length > 0) {
      const roleCollectionIdentifiers = roleCollection.map(roleItem => getRoleIdentifier(roleItem)!);
      const rolesToAdd = roles.filter(roleItem => {
        const roleIdentifier = getRoleIdentifier(roleItem);
        if (roleIdentifier == null || roleCollectionIdentifiers.includes(roleIdentifier)) {
          return false;
        }
        roleCollectionIdentifiers.push(roleIdentifier);
        return true;
      });
      return [...rolesToAdd, ...roleCollection];
    }
    return roleCollection;
  }

  protected convertDateFromClient(role: IRole): IRole {
    return Object.assign({}, role, {
      creationDate: role.creationDate?.isValid() ? role.creationDate.toJSON() : undefined,
      updatedDate: role.updatedDate?.isValid() ? role.updatedDate.toJSON() : undefined,
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
      res.body.forEach((role: IRole) => {
        role.creationDate = role.creationDate ? dayjs(role.creationDate) : undefined;
        role.updatedDate = role.updatedDate ? dayjs(role.updatedDate) : undefined;
      });
    }
    return res;
  }
}
