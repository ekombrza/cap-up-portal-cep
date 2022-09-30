import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, ReplaySubject, tap } from 'rxjs';
import { Navigation } from 'src/app/models-services/navigation/navigation.types';

@Injectable({
    providedIn: 'root'
})
export class CoreNavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    private _space: ReplaySubject<String> = new ReplaySubject<String>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }

     /**
     * Getter for space
     */
      get space$(): Observable<String>
      {
          return this._space.asObservable();
      }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation>
    {
        return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            tap((navigation) => {
                this._navigation.next(navigation);
            })
        );
    }

    /**
     * Get all space data
     */
     changeSpace(space: string): Observable<String>
     { 
        this._space.next(space);
        return of(space);
     }
}
