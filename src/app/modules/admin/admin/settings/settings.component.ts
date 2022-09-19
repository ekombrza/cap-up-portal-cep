import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { MediaWatcherService } from 'src/@ekbz/services/media-watcher';
import { AuthService } from 'src/app/models-services/auth/auth.service';

@Component({
    selector       : 'settings',
    templateUrl    : './settings.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit, OnDestroy
{
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'notifications';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: MediaWatcherService,
        private _authService: AuthService
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
        // Setup available panels
        this.panels = [

            {
                id         : 'notifications',
                icon       : 'heroicons_outline:bell',
                title      : 'Notifications',
                description: 'Gérez vos notifications sur chaque canaux'
            },
            {
                id         : 'team',
                icon       : 'heroicons_outline:user-group',
                title      : 'Membres',
                description: 'Gérez léquipe existante et modifiez les rôles/autorisations',
                roles: ['2::Super Administrateur']
            }
        ];

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode and drawerOpened
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else
                {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
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
     * Navigate to the panel
     *
     * @param panel
     */
    goToPanel(panel: string): void
    {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if ( this.drawerMode === 'over' )
        {
            this.drawer.close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    getPanelInfo(id: string): any
    {
        return this.panels.find(panel => panel.id === id);
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

    isAuthorize(roles: string[]){
        const userRoles= this._authService.getRoles();
        if(userRoles){
            const listUserRoles = userRoles.split(',');
            return listUserRoles.some(r=> roles.indexOf(r) >= 0);
        }
        return false;
    }
}
