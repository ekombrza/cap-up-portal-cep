import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MediaWatcherService } from 'src/@ekbz/services/media-watcher';
import { NavigationItem, NavigationService, VerticalNavigationComponent } from 'src/@ekbz/components/navigation';
import { User } from 'src/app/models-services/user/user.model';
import { UserService } from 'src/app/models-services/user/user.service';
import { CoreNavigationService } from 'src/app/models-services/navigation/navigation.service';
import { Navigation } from 'src/app/models-services/navigation/navigation.types';
import { Membre } from 'src/app/models-services/membre/membre.model';
import { Church } from 'src/app/models-services/church/church.model';
import { MembreService } from 'src/app/models-services/membre/membre.service';
import { ChurchService } from 'src/app/models-services/church/church.service';

@Component({
    selector     : 'classy-layout',
    templateUrl  : './classy.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ClassyLayoutComponent implements OnInit, OnDestroy
{
    spaceSelected = 'ressources';
    selectedSpaceNavigation: NavigationItem[];
    isScreenSmall: boolean;
    navigation: Navigation;
    user: User;
    membre: Membre;
    church: Church;
    avatar: String;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _membreService: MembreService,
        private _churchService: ChurchService,
        private _mediaWatcherService: MediaWatcherService,
        private _coreNavigationService: CoreNavigationService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to navigation data
        this._coreNavigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
                this.selectedSpaceNavigation = this.getSpaceNavigation();
            });

        // Subscribe to the user service
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                this.user = user;
            });
        
        // Subscribe to membres changes
        this._membreService.membre$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((membre: Membre) => {
                this.membre = membre;
                console.log('membre',this.membre);
                if(membre.imageBlob){
                    this.avatar = 'data:'+this.membre.imageBlobContentType + ';base64,' + this.membre.imageBlob;
                }
                
            });
        
        // Subscribe to churches changes
        this._churchService.church$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((church: Church) => {
                this.church = church;
                console.log('church',this.church)
            });

        // Subscribe to media changes
        this._mediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
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
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._navigationService.getComponent<VerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    getSpaceNavigation(){
        console.log('this.spaceSelected = ',this.spaceSelected);
        console.log('this.navigation.default = ',this.navigation.default);
        console.log('this.navigation.default.filter((res)=> res.id === this.spaceSelected )[0].nav = ', this.navigation.default.filter((res)=> res.id === this.spaceSelected )[0].nav);
        return this.navigation.default.filter((res)=> res.id === this.spaceSelected )[0].nav;
    }

    onSelectChange(event){
        console.log('onSelectChange event : ',event);
        this.spaceSelected = event.value;
        this.selectedSpaceNavigation = this.getSpaceNavigation();
        switch (this.spaceSelected) {
            case 'contacts':
                this._router.navigate(['/apps/contacts/contacts']);
                break;
            case 'ressources':
                this._router.navigate(['/apps/ressources/formations']);
                break;
            default:
                break;
        }
    }
}
