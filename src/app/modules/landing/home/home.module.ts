import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { LandingHomeComponent } from 'src/app/modules/landing/home/home.component';
import { landingHomeRoutes } from 'src/app/modules/landing/home/home.routing';
import { CardComponent, CardModule } from 'src/@ekbz/components/card';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';

@NgModule({
    declarations: [
        LandingHomeComponent,
    ],
    imports     : [
        RouterModule.forChild(landingHomeRoutes),
        IonicModule,
        MatButtonModule,
        MatIconModule,
        SwiperModule,
        CardModule,
        SharedModule
    ]
})
export class LandingHomeModule
{
}
