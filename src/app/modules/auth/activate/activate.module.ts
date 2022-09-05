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
import { AuthActivateComponent } from './activate.component';
import { authActivateRoutes } from './activate.routing';


@NgModule({
    declarations: [
        AuthActivateComponent
    ],
    imports     : [
        RouterModule.forChild(authActivateRoutes),
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
export class AuthActivateModule
{
}
