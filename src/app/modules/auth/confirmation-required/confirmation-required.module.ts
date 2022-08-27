import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CardModule } from 'src/@ekbz/components/card';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthConfirmationRequiredComponent } from 'src/app/modules/auth/confirmation-required/confirmation-required.component';
import { authConfirmationRequiredRoutes } from 'src/app/modules/auth/confirmation-required/confirmation-required.routing';

@NgModule({
    declarations: [
        AuthConfirmationRequiredComponent
    ],
    imports     : [
        RouterModule.forChild(authConfirmationRequiredRoutes),
        MatButtonModule,
        CardModule,
        SharedModule
    ]
})
export class AuthConfirmationRequiredModule
{
}
