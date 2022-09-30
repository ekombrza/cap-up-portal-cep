import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Contact, Country, Tag } from './membres.types';
import { Membre } from 'src/app/models-services/membre/membre.model';
import { baseUrlJHipsterApi } from 'src/environments/environment';
import dayjs from 'dayjs';
import { Telephone } from 'src/app/models-services/telephone/telephone.model';
import { createRequestOption } from 'src/@ekbz/services/utils';
import { Adress } from 'src/app/models-services/adress/adress.model';
import { Enfant } from 'src/app/models-services/enfant/enfant.model';


@Injectable({
    providedIn: 'root'
})
export class MembresService
{

    public baseUrlExtended = baseUrlJHipsterApi + 'api/extended/membres';
    public baseUrlTelephone = baseUrlJHipsterApi + 'api/telephones';
    public baseUrlAdresse = baseUrlJHipsterApi + 'api/adresses';
    public baseUrlEnfant = baseUrlJHipsterApi + 'api/enfants';
    public baseUrl = baseUrlJHipsterApi + 'api/membres';
    public resourceUrl = baseUrlJHipsterApi + 'api/membres';

    // Private
    private _membre: BehaviorSubject<Membre | null> = new BehaviorSubject(null);
    private _membres: BehaviorSubject<Membre[] | null> = new BehaviorSubject(null);
    private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(null);
    private _telephones: BehaviorSubject<Telephone[] | null> = new BehaviorSubject(null);
    private _adresse: BehaviorSubject<Adress[] | null> = new BehaviorSubject(null);
    private _enfants: BehaviorSubject<Enfant[] | null> = new BehaviorSubject(null);

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
     * Getter for membre
     */
    get membre$(): Observable<Membre>
    {
        return this._membre.asObservable();
    }

    /**
     * Getter for membres
     */
    get membres$(): Observable<Membre[]>
    {
        return this._membres.asObservable();
    }

    /**
     * Getter for countries
     */
    get countries$(): Observable<Country[]>
    {
        return this._countries.asObservable();
    }

    /**
     * Getter for telephones
     */
    get telephones$(): Observable<Telephone[]>
    {
        return this._telephones.asObservable();
    }

    /**
     * Getter for enfants
     */
     get enfants$(): Observable<Enfant[]>
     {
         return this._enfants.asObservable();
     }

     
    /**
     * Getter for adresse
     */
     get adresse$(): Observable<Adress[]>
     {
         return this._adresse.asObservable();
     }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get membres
     */
    getMembres(req?: any): Observable<Membre[]>
    {
        const options = createRequestOption(req);
        return this._httpClient.get<Membre[]>(this.baseUrlExtended, { params: options}).pipe(
            tap((membrres) => {
                this._membres.next(membrres);
            })
        );
    }

    /**
     * Search membres with given query
     *
     * @param query
     */
    searchMembres(query: string): Observable<Membre[]>
    {
        return this._httpClient.get<Membre[]>('api/apps/contacts/search', {
            params: {query}
        }).pipe(
            tap((membres) => {
                this._membres.next(membres);
            })
        );
    }

    /**
     * Get membre by id
     */
    getMembreById(id: number): Observable<Membre>
    {
        return this._membres.pipe(
            take(1),
            map((membres) => {

                // Find the membre
                const membre = membres.find(item => item.id === id) || null;

                // Update the membre
                this._membre.next(membre);

                // Return the membre
                return membre;
            }),
            switchMap((membre) => {

                if ( !membre )
                {
                    return throwError('Could not found membre with id of ' + id + '!');
                }

                return of(membre);
            })
        );
    }

    /**
     * Create membre
     */
    createMembre(): Observable<Membre>
    {
        return this.membres$.pipe(
            take(1),

            switchMap(membres => this._httpClient.post<Membre>(this.baseUrlExtended, 
                {firstName: 'nouveau', 
                lastName:'contact', 
                inAppNotification:true,
                emailNotification:true,
                telephones:[],
                jobStatus:'CONTACT',
                instantStatus: 'online',
                creationDate:dayjs(),
                updateDate:dayjs(),
            }).pipe(
                map((newMembre) => {

                    // Update the membres with the new membre
                    this._membres.next([newMembre, ...membres]);

                    // Return the new membre
                    return newMembre;
                })
            ))
        );
    }

    /**
     * Update membre
     *
     * @param id
     * @param membre
     */
    updateMembre(id: number, membre: Membre): Observable<Membre>
    {
        return this.membres$.pipe(
            take(1),
            switchMap(membres => this._httpClient.patch<Membre>(this.baseUrlExtended + '/' + id, membre
            ).pipe(
                map((updatedMembre) => {

                    // Find the index of the updated membre
                    const index = membres.findIndex(item => item.id === id);

                    // Update the membre
                    membres[index] = updatedMembre;

                    // Update the membres
                    this._membres.next(membres);

                    // Return the updated membre
                    return updatedMembre;
                }),
                switchMap(updatedMembre => this.membre$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the membre if it's selected
                        this._membre.next(updatedMembre);

                        // Return the updated membre
                        return updatedMembre;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the membre
     *
     * @param id
     */
    deleteMembre(id: number): Observable<boolean>
    {
        return this.membres$.pipe(
            take(1),
            switchMap(membres => this._httpClient.delete(this.baseUrlExtended + '/' + id).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted membre
                    const index = membres.findIndex(item => item.id === id);

                    // Delete the membre
                    membres.splice(index, 1);

                    // Update the membres
                    this._membres.next(membres);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }

    /**
     * Get countries
     */
    getCountries(): Observable<Country[]>
    {
        return this._httpClient.get<Country[]>('api/apps/contacts/countries').pipe(
            tap((countries) => {
                this._countries.next(countries);
            })
        );
    }

    /**
     * Get adreesse
     */
    getAddresse(req?: any): Observable<Adress[]>
    {
        const options = createRequestOption(req);
        return this._httpClient.get<Adress[]>(this.baseUrlAdresse, { params: options }).pipe(
            tap((adress) => {
                this._adresse.next(adress);
            })
        );
    }

    /**
     * Get membre telephone
     */
     getTelephones(req?: any): Observable<Telephone[]>
     {
        const options = createRequestOption(req);
         return this._httpClient.get<Telephone[]>(this.baseUrlTelephone, { params: options}).pipe(
             tap((telephones) => {
                this._telephones.next(telephones);
             })
         );
     }

     /**
     * Get enfants
     */
     getEnfants(req?: any): Observable<Enfant[]>
     {
        const options = createRequestOption(req);
         return this._httpClient.get<Enfant[]>(this.baseUrlEnfant, { params: options}).pipe(
             tap((enfants) => {
                 this._enfants.next(enfants);
             })
         );
     }

    

    /**
     * Update the avatar of the given membre
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: number, avatar: FormData): Observable<Membre>
    {
        return this.membres$.pipe(
            take(1),
            switchMap(membres => this._httpClient.post<Membre>(this.baseUrlExtended + '/upload/' + id, 
                avatar
            ).pipe(
                map((updatedMembre) => {

                    // Find the index of the updated membre
                    if(membres){
                        const index = membres.findIndex(item => item.id === id);

                        // Update the membre
                        membres[index] = updatedMembre;
    
                        // Update the membres
                        this._membres.next(membres);
                    }

                    // Return the updated membre
                    return updatedMembre;
                }),
                switchMap(updatedMembre => this.membre$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the membre if it's selected
                        this._membre.next(updatedMembre);

                        // Return the updated membre
                        return updatedMembre;
                    })
                    
                ))
            ))
        );
    }
}
