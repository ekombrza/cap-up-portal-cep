import { Route } from '@angular/router';
import { AuthSignUpComponent } from 'src/app/modules/auth/sign-up/sign-up.component';

export const authSignupRoutes: Route[] = [
    {
        path     : '',
        component: AuthSignUpComponent
    }
];
