import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { LanguagesComponent } from 'src/app/layout/common/languages/languages.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [
        LanguagesComponent
    ],
    imports     : [
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        SharedModule
    ],
    exports     : [
        LanguagesComponent
    ]
})
export class LanguagesModule
{
}
