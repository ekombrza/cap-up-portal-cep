import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CardModule } from 'src/@ekbz/components/card';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthSignOutComponent } from 'src/app/modules/auth/sign-out/sign-out.component';
import { authSignOutRoutes } from 'src/app/modules/auth/sign-out/sign-out.routing';

@NgModule({
    declarations: [
        AuthSignOutComponent
    ],
    imports     : [
        RouterModule.forChild(authSignOutRoutes),
        MatButtonModule,
        CardModule,
        SharedModule
    ]
})
export class AuthSignOutModule
{
}
