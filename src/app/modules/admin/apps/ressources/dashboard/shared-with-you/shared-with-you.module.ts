import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedWithYouPageRoutingModule } from './shared-with-you-routing.module';

import { SharedWithYouPage } from './shared-with-you.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedWithYouPageRoutingModule
  ],
  declarations: [SharedWithYouPage]
})
export class SharedWithYouPageModule {}
