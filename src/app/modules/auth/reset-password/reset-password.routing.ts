import { Route } from '@angular/router';
import { AuthResetPasswordComponent } from 'src/app/modules/auth/reset-password/reset-password.component';

export const authResetPasswordRoutes: Route[] = [
    {
        path     : '',
        component: AuthResetPasswordComponent
    }
];
