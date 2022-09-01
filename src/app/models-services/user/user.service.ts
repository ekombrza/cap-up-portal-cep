import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { User } from 'src/app/models-services/user/user.model';
import { baseUrlJHipsterApi } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    public resourceUrlPublic = baseUrlJHipsterApi + 'api/admin/extended/users';
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

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
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User>
    {
        return this._httpClient.get<User>(`${this.resourceUrlPublic}/currentConnected`).pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }


}
