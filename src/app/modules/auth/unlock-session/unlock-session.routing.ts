import { Route } from '@angular/router';
import { AuthUnlockSessionComponent } from 'src/app/modules/auth/unlock-session/unlock-session.component';

export const authUnlockSessionRoutes: Route[] = [
    {
        path     : '',
        component: AuthUnlockSessionComponent
    }
];
