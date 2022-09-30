import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { Adress } from 'src/app/models-services/adress/adress.model';
import { Membre } from 'src/app/models-services/membre/membre.model';
import { Telephone } from 'src/app/models-services/telephone/telephone.model';
import { MembresService } from './membres.service';
import { Country, Tag } from './membres.types';

@Injectable({
    providedIn: 'root'
})
export class MembresResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _membresService: MembresService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Membre[]>
    {
        return this._membresService.getMembres();
    }
}

@Injectable({
    providedIn: 'root'
})
export class MembresMembreResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _membresService: MembresService,
        private _router: Router
    )
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Membre>
    {
        return this._membresService.getMembreById(+route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested membre is not available
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
    }
}

@Injectable({
    providedIn: 'root'
})
export class MembresCountriesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _membresService: MembresService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Country[]>
    {
        return this._membresService.getCountries();
    }
}




