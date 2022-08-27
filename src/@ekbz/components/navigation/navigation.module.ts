import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScrollbarModule } from 'src/@ekbz/directives/scrollbar/public-api';
import { HorizontalNavigationBasicItemComponent } from 'src/@ekbz/components/navigation/horizontal/components/basic/basic.component';
import { HorizontalNavigationBranchItemComponent } from 'src/@ekbz/components/navigation/horizontal/components/branch/branch.component';
import { HorizontalNavigationDividerItemComponent } from 'src/@ekbz/components/navigation/horizontal/components/divider/divider.component';
import { HorizontalNavigationSpacerItemComponent } from 'src/@ekbz/components/navigation/horizontal/components/spacer/spacer.component';
import { HorizontalNavigationComponent } from 'src/@ekbz/components/navigation/horizontal/horizontal.component';
import { VerticalNavigationAsideItemComponent } from 'src/@ekbz/components/navigation/vertical/components/aside/aside.component';
import { VerticalNavigationBasicItemComponent } from 'src/@ekbz/components/navigation/vertical/components/basic/basic.component';
import { VerticalNavigationCollapsableItemComponent } from 'src/@ekbz/components/navigation/vertical/components/collapsable/collapsable.component';
import { VerticalNavigationDividerItemComponent } from 'src/@ekbz/components/navigation/vertical/components/divider/divider.component';
import { VerticalNavigationGroupItemComponent } from 'src/@ekbz/components/navigation/vertical/components/group/group.component';
import { VerticalNavigationSpacerItemComponent } from 'src/@ekbz/components/navigation/vertical/components/spacer/spacer.component';
import { VerticalNavigationComponent } from 'src/@ekbz/components/navigation/vertical/vertical.component';

@NgModule({
    declarations: [
        HorizontalNavigationBasicItemComponent,
        HorizontalNavigationBranchItemComponent,
        HorizontalNavigationDividerItemComponent,
        HorizontalNavigationSpacerItemComponent,
        HorizontalNavigationComponent,
        VerticalNavigationAsideItemComponent,
        VerticalNavigationBasicItemComponent,
        VerticalNavigationCollapsableItemComponent,
        VerticalNavigationDividerItemComponent,
        VerticalNavigationGroupItemComponent,
        VerticalNavigationSpacerItemComponent,
        VerticalNavigationComponent
    ],
    imports     : [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        ScrollbarModule
    ],
    exports     : [
        HorizontalNavigationComponent,
        VerticalNavigationComponent
    ]
})
export class NavigationModule
{
}
