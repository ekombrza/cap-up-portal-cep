import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CardModule } from 'src/@ekbz/components/card';
import { AlertModule } from 'src/@ekbz/components/alert';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthUnlockSessionComponent } from 'src/app/modules/auth/unlock-session/unlock-session.component';
import { authUnlockSessionRoutes } from 'src/app/modules/auth/unlock-session/unlock-session.routing';

@NgModule({
    declarations: [
        AuthUnlockSessionComponent
    ],
    imports     : [
        RouterModule.forChild(authUnlockSessionRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        CardModule,
        AlertModule,
        SharedModule
    ]
})
export class AuthUnlockSessionModule
{
}
