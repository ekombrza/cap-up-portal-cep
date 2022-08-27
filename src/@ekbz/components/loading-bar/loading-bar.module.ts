import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingBarComponent } from 'src/@ekbz/components/loading-bar/loading-bar.component';

@NgModule({
    declarations: [
        LoadingBarComponent
    ],
    imports     : [
        CommonModule,
        MatProgressBarModule
    ],
    exports     : [
        LoadingBarComponent
    ]
})
export class LoadingBarModule
{
}
