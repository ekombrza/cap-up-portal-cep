import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { Categorie, CategoriePagination } from 'src/app/models-services/categorie/categorie.model';
import { CategorieService } from 'src/app/models-services/categorie/categorie.service';



@Injectable({
    providedIn: 'root'
})
export class CategoriesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _categorieService: CategorieService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Categorie[]>
    {
        
        return this._categorieService.getCategories();
    }
}

