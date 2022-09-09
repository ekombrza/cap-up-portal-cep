import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { baseUrlJHipsterApi } from 'src/environments/environment';
import { createRequestOption, isPresent } from 'src/@ekbz/services/utils';
import { getRoleIdentifier, IRole, Role, RolePagination } from './role.model';
import { TypeRoleEnum } from './type-role-enum.model';

export type EntityResponseType = HttpResponse<IRole>;
export type EntityArrayResponseType = HttpResponse<IRole[]>;

@Injectable({ providedIn: 'root' })
export class RoleService {
  public resourceUrl = baseUrlJHipsterApi + 'api/roles';
  public resourceUrlExtended = baseUrlJHipsterApi + 'api/extended/';
  public resourceUrlExtendedPublic = baseUrlJHipsterApi + 'api/extendedPublic';

  private _pagination: BehaviorSubject<RolePagination | null> = new BehaviorSubject(null);
  private _roles: BehaviorSubject<Role[] | null> = new BehaviorSubject(null);
  private _role: BehaviorSubject<Role | null> = new BehaviorSubject(null);


  constructor(protected http: HttpClient) {}

  /**
   * Getter for roles
   */
  get roles$(): Observable<Role[]>
  {
      return this._roles.asObservable();
  }

  /**
   * Getter for role
   */
    get role$(): Observable<Role>
    {
        return this._role.asObservable();
    }

    /**
     * Getter for pagination
     */
     get pagination$(): Observable<RolePagination>
     {
         return this._pagination.asObservable();
     }

  /**
   * Get roles
   *
   *
   * @param page
   * @param size
   * @param sort
   * @param order
   * @param search
   */
    getRoles(req?: any):Observable<Role[]>
  {
    const options = createRequestOption(req);
    return this.http
        .get<IRole[]>(`${this.resourceUrlExtendedPublic}/rolesPageable`, {  params: options,observe: 'response' })
        .pipe(
          map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)),
          map((res)=> res.body),
          tap((response) => {
            this._roles.next(response);
            //this._pagination.next(response.pagination);
          })
        );
 }

 /**
     * Get role by id
     */
  getRoleById(id: number): Observable<Role>
  {
      return this._roles.pipe(
          take(1),
          map((roles) => {

              // Find the role
              const role = roles.find(item => item.id === id) || null;

              // Update the role
              this._role.next(role);

              // Return the role
              return role;
          }),
          switchMap((role) => {

              if ( !role )
              {
                  return throwError('Could not found role with id of ' + id + '!');
              }

              return of(role);
          })
      );
  }

  /**
     * Create role
     */
   createRole(): Observable<Role>
   {
      let role = new Role();
      role.application = {id:1};
      role.name = 'nouvelle catégorie';
      role.typeRole = TypeRoleEnum.PRIVATE;
      role.creationDate = dayjs();
      role.updatedDate = dayjs();
       return this.roles$.pipe(
           take(1),
           switchMap(roles => this.http.post<Role>(this.resourceUrl, role).pipe(
               map((newRole) => {

                   // Update the roles with the new role
                   this._roles.next([newRole, ...roles]);

                   // Return the new role
                   return newRole;
               })
           ))
       );
   }

   /**
     * Update role
     *
     * @param id
     * @param role
     */
    updateRole(id: number, role: Role): Observable<Role>
    {
        return this.roles$.pipe(
            take(1),
            switchMap(roles => this.http.patch<Role>(this.resourceUrl + '/' + id, 
                role
            ).pipe(
                map((updatedRole) => {

                    // Find the index of the updated role
                    const index = roles.findIndex(item => item.id === id);

                    // Update the role
                    roles[index] = updatedRole;

                    // Update the roles
                    this._roles.next(roles);

                    // Return the updated role
                    return updatedRole;
                }),
                switchMap(updatedRole => this.role$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the role if it's selected
                        this._role.next(updatedRole);

                        // Return the updated role
                        return updatedRole;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the role
     *
     * @param id
     */
     deleteRole(id: number): Observable<boolean>
     {
         return this.roles$.pipe(
             take(1),
             switchMap(roles => this.http.delete(this.resourceUrl + '/' +id).pipe(
                 map((isDeleted: boolean) => {
 
                     // Find the index of the deleted role
                     const index = roles.findIndex(item => item.id === id);
 
                     // Delete the role
                    roles.splice(index, 1);
 
                     // Update the roles
                     this._roles.next(roles);
 
                     // Return the deleted status
                     return isDeleted;
                 })
             ))
         );
     }

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
      .get<IRole>(`${this.resourceUrlExtendedPublic}/roles/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRole[]>(`${this.resourceUrlExtendedPublic}/roles`, { params: options, observe: 'response' })
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
