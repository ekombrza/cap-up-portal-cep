import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { filter, fromEvent, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { MembresService } from '../membres.service';
import { MediaWatcherService } from 'src/@ekbz/services/media-watcher';
import { Membre } from 'src/app/models-services/membre/membre.model';
import { Country } from '../membres.types';

@Component({
    selector       : 'membres-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembresListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    membres$: Observable<Membre[]>;

    membresCount: number = 0;
    membresTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    countries: Country[];
    drawerMode: 'side' | 'over';
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedMembre: Membre;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _membresService: MembresService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: MediaWatcherService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the membres
        this.membres$ = this._membresService.membres$;
        this._membresService.membres$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((membres: Membre[]) => {
                console.log("membres : ", membres);
                // Update the counts
                this.membresCount = membres.length;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the membre
        this._membresService.membre$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((membre: Membre) => {

                // Update the selected membre
                this.selectedMembre = membre;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the countries
        this._membresService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((countries: Country[]) => {

                // Update the countries
                this.countries = countries;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap(query =>

                    // Search
                    this._membresService.searchMembres(query)
                )
            )
            .subscribe();

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if ( !opened )
            {
                // Remove the selected membre when drawer closed
                this.selectedMembre = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode if the given breakpoint is active
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                }
                else
                {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Listen for shortcuts
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(event =>
                    (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
                    && (event.key === '/') // '/'
                )
            )
            .subscribe(() => {
                this.createMembre();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void
    {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create membre
     */
    createMembre(): void
    {
        // Create the membre
        this._membresService.createMembre().subscribe((newMembre) => {

            // Go to the new membre
            this._router.navigate(['./', newMembre.id], {relativeTo: this._activatedRoute});

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
