import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationModule } from 'src/@ekbz/components/navigation';
import { LoadingBarModule } from 'src/@ekbz/components/loading-bar';
import { FullscreenModule } from 'src/@ekbz/components/fullscreen/fullscreen.module';
import { LanguagesModule } from 'src/app/layout/common/languages/languages.module';
import { MessagesModule } from 'src/app/layout/common/messages/messages.module';
import { NotificationsModule } from 'src/app/layout/common/notifications/notifications.module';
import { QuickChatModule } from 'src/app/layout/common/quick-chat/quick-chat.module';
import { SearchModule } from 'src/app/layout/common/search/search.module';
import { ShortcutsModule } from 'src/app/layout/common/shortcuts/shortcuts.module';
import { UserModule } from 'src/app/layout/common/user/user.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClassyLayoutComponent } from 'src/app/layout/layouts/vertical/classy/classy.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    declarations: [
        ClassyLayoutComponent
    ],
    imports     : [
        HttpClientModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatFormFieldModule,
        MatSelectModule,
        FullscreenModule,
        LoadingBarModule,
        NavigationModule,
        LanguagesModule,
        MessagesModule,
        NotificationsModule,
        QuickChatModule,
        SearchModule,
        ShortcutsModule,
        UserModule,
        SharedModule
    ],
    exports     : [
        ClassyLayoutComponent
    ]
})
export class ClassyLayoutModule
{
}
