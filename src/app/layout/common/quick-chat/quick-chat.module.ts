import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DrawerModule } from 'src/@ekbz/components/drawer';
import { ScrollbarModule } from 'src/@ekbz/directives/scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuickChatComponent } from 'src/app/layout/common/quick-chat/quick-chat.component';

@NgModule({
    declarations: [
        QuickChatComponent
    ],
    imports     : [
        RouterModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        DrawerModule,
        ScrollbarModule,
        SharedModule
    ],
    exports     : [
        QuickChatComponent
    ]
})
export class QuickChatModule
{
}
