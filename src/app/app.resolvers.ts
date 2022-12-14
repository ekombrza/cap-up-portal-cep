import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { MessagesService } from 'src/app/layout/common/messages/messages.service';
import { NotificationsService } from 'src/app/layout/common/notifications/notifications.service';
import { QuickChatService } from 'src/app/layout/common/quick-chat/quick-chat.service';
import { ShortcutsService } from 'src/app/layout/common/shortcuts/shortcuts.service';
import { MembreService } from './models-services/membre/membre.service';
import { ChurchService } from './models-services/church/church.service';
import { CoreNavigationService } from './models-services/navigation/navigation.service';
import { UserService } from './models-services/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class InitialDataResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _messagesService: MessagesService,
        private _navigationService: CoreNavigationService,
        private _notificationsService: NotificationsService,
        private _quickChatService: QuickChatService,
        private _shortcutsService: ShortcutsService,
        private _userService: UserService,
        private _membreService: MembreService,
        private _churchService: ChurchService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Use this resolver to resolve initial mock-api for the application
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        // Fork join multiple API endpoint calls to wait all of them to finish
        return forkJoin([
            this._userService.get(),
            this._membreService.get(),
            this._churchService.get(),
            this._navigationService.get(),
            //this._messagesService.getAll(),
            //this._notificationsService.getAll(),
            //this._quickChatService.getChats(),
            this._shortcutsService.getAll(),

        ]);
    }
}
