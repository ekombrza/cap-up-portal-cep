import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingBarModule } from 'src/@ekbz/components/loading-bar';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmptyLayoutComponent } from 'src/app/layout/layouts/empty/empty.component';

@NgModule({
    declarations: [
        EmptyLayoutComponent
    ],
    imports     : [
        RouterModule,
        LoadingBarModule,
        SharedModule
    ],
    exports     : [
        EmptyLayoutComponent
    ]
})
export class EmptyLayoutModule
{
}
