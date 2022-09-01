import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { IShortcuts } from 'src/app/layout/common/shortcuts/shortcuts.types';
import { baseUrlJHipsterApi } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ShortcutsService
{
    private _shortcuts: ReplaySubject<IShortcuts[]> = new ReplaySubject<IShortcuts[]>(1);
    public resourceUrlExtended = baseUrlJHipsterApi + 'api/shortcuts';
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
     * Getter for shortcuts
     */
    get shortcuts$(): Observable<IShortcuts[]>
    {
        return this._shortcuts.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all messages
     */
    getAll(): Observable<IShortcuts[]>
    {
        return this._httpClient.get<IShortcuts[]>(this.resourceUrlExtended).pipe(
            tap((shortcuts) => {
                this._shortcuts.next(shortcuts);
            })
        );
    }

    /**
     * Create a shortcut
     *
     * @param shortcut
     */
    create(shortcutsDTO: IShortcuts): Observable<IShortcuts>
    {
        return this.shortcuts$.pipe(
            take(1),
            switchMap(shortcuts => this._httpClient.post<IShortcuts>(this.resourceUrlExtended, shortcutsDTO).pipe(
                map((newShortcut) => {

                    // Update the shortcuts with the new shortcut
                    this._shortcuts.next([...shortcuts, newShortcut]);

                    // Return the new shortcut from observable
                    return newShortcut;
                })
            ))
        );
    }

    /**
     * Update the shortcut
     *
     * @param id
     * @param shortcut
     */
    update(id: number, shortcut: IShortcuts): Observable<IShortcuts>
    {
        return this.shortcuts$.pipe(
            take(1),
            switchMap(shortcuts => this._httpClient.patch<IShortcuts>(`${this.resourceUrlExtended}/${id}`, 
                shortcut
            ).pipe(
                map((updatedShortcut: IShortcuts) => {

                    // Find the index of the updated shortcut
                    const index = shortcuts.findIndex(item => item.id === id);

                    // Update the shortcut
                    shortcuts[index] = updatedShortcut;

                    // Update the shortcuts
                    this._shortcuts.next(shortcuts);

                    // Return the updated shortcut
                    return updatedShortcut;
                })
            ))
        );
    }

    /**
     * Delete the shortcut
     *
     * @param id
     */
    delete(id: number): Observable<boolean>
    {
        return this.shortcuts$.pipe(
            take(1),
            switchMap(shortcuts => this._httpClient.delete<boolean>(`${this.resourceUrlExtended}/${id}`).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted shortcut
                    const index = shortcuts.findIndex(item => item.id === id);

                    // Delete the shortcut
                    shortcuts.splice(index, 1);

                    // Update the shortcuts
                    this._shortcuts.next(shortcuts);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }
}
