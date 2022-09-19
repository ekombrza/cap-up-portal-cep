import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TypeFile } from 'src/app/models-services/type-file/type-file.model';
import { TypeFileService } from 'src/app/models-services/type-file/type-file.service';



@Injectable({
    providedIn: 'root'
})
export class TypeFilesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _typeFileService: TypeFileService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TypeFile[]>
    {
        
        return this._typeFileService.getTypeFiles();
    }
}

