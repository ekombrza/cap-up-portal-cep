import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { Role, RolePagination } from 'src/app/models-services/role/role.model';
import { RoleService } from 'src/app/models-services/role/role.service';



@Injectable({
    providedIn: 'root'
})
export class RolesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _roleService: RoleService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Role[]>
    {
        
        return this._roleService.getRoles({'applicationId.equals':1});
    }
}

