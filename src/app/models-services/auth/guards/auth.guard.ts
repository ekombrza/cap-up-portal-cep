import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/models-services/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad
{
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
    {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(route, redirectUrl);
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(childRoute, redirectUrl);
    }

    /**
     * Can load
     *
     * @param route
     * @param segments
     */
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean
    {
        return this._check(null, '/');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @param redirectURL
     * @private
     */
    private _check(route: ActivatedRouteSnapshot, redirectURL: string): Observable<boolean>
    {
        // Check the authentication status
        return this._authService.check()
                   .pipe(
                       switchMap((authenticated) => {

                           // If the user is not authenticated...
                           if ( !authenticated )
                           {
                               // Redirect to the sign-in page
                               this._router.navigate(['sign-in'], {queryParams: {redirectURL}});

                               // Prevent the access
                               return of(false);
                           }

                           const userRoles = this._authService.getRoles();
                           console.log('guard userRole : ',userRoles );
                           console.log('guard route.data : ',route.data);
                           if(userRoles){
                                const listUserRoles = userRoles.split(',');
                               
                                
                                if (route.data && route.data.roles && !listUserRoles.some(r=> route.data.roles.indexOf(r) >= 0)) {
                                    this._router.navigate(['/public/home']);
                                    return of(false);
                                }
                            }
                           // Allow the access
                           return of(true);
                       })
                   );
    }
}
