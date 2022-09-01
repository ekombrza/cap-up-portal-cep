import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models-services/user/user.model';
import { UserService } from 'src/app/models-services/user/user.service';
import { Membre } from 'src/app/models-services/membre/membre.model';
import { Church } from 'src/app/models-services/church/church.model';
import { MembreService } from 'src/app/models-services/membre/membre.service';
import { ChurchService } from 'src/app/models-services/church/church.service';
import dayjs from 'dayjs';

@Component({
    selector       : 'user',
    templateUrl    : './user.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'user'
})
export class UserComponent implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: User;
    membre: Membre;
    church: Church;
    avatar: String;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        private _membreService: MembreService,
        private _churchService: ChurchService
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
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
                console.log('user',this.user)
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        // Subscribe to membres changes
        this._membreService.membre$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((membre: Membre) => {
                this.membre = membre;
                console.log('membre',this.membre);
                this.avatar = 'data:'+this.membre.imageBlobContentType + ';base64,' + this.membre.imageBlob;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        
        // Subscribe to churches changes
        this._churchService.church$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((church: Church) => {
                this.church = church;
                console.log('church',this.church)
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
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(instantStatus: string): void
    {
        // Return if user is not available
        if ( !this.user )
        {
            return;
        }

        // Update the user
        const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
        this._membreService.update({
            ...this.membre,
            instantStatus,
            creationDate: dayjs(this.membre.creationDate, DATE_TIME_FORMAT),
            updatedDate: dayjs()
        }).subscribe();
    }

    /**
     * Sign out
     */
    signOut(): void
    {
        this._router.navigate(['/sign-out']);
    }

    /**
     * Go to profil
     */
     goToProfil(): void
     {
         this._router.navigate(['/admin/profil']);
     }

     /**
     * Go to church
     */
      goToChurch(): void
      {
          this._router.navigate(['/admin/church']);
      }

      /**
     * Go to Settings
     */
       goToSettings(): void
       {
           this._router.navigate(['/admin/settings']);
       }
}
