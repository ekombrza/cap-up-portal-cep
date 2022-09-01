import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CardModule } from 'src/@ekbz/components/card';
import { AlertModule } from 'src/@ekbz/components/alert';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthSignInComponent } from 'src/app/modules/auth/sign-in/sign-in.component';
import { authSignInRoutes } from 'src/app/modules/auth/sign-in/sign-in.routing';

@NgModule({
    declarations: [
        AuthSignInComponent
    ],
    imports     : [
        RouterModule.forChild(authSignInRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        CardModule,
        AlertModule,
        SharedModule,
    ]
})
export class AuthSignInModule
{
}
