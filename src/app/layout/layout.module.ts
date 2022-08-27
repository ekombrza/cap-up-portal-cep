import { NgModule } from '@angular/core';
import { LayoutComponent } from 'src/app/layout/layout.component';
import { EmptyLayoutModule } from 'src/app/layout/layouts/empty/empty.module';
import { ClassyLayoutModule } from 'src/app/layout/layouts/vertical/classy/classy.module';
import { SettingsModule } from 'src/app/layout/common/settings/settings.module';
import { SharedModule } from 'src/app/shared/shared.module';

const layoutModules = [
    // Empty
    EmptyLayoutModule,

    // Vertical navigation
    ClassyLayoutModule,
];

@NgModule({
    declarations: [
        LayoutComponent
    ],
    imports     : [
        SharedModule,
        SettingsModule,
        ...layoutModules
    ],
    exports     : [
        LayoutComponent,
        ...layoutModules
    ]
})
export class LayoutModule
{
}
