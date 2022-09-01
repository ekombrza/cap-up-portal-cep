import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { IonicModule } from '@ionic/angular';
import { ImageCropperModule } from 'ngx-image-cropper';

import { ProfilPageRoutingModule } from './profil-routing.module';
import { ProfilPage } from './profil.page';
import { FormatDatePipeSharedModule } from 'src/@ekbz/pipes/format-date/format-date-pipe-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilPageRoutingModule,
    MatCardModule,
    ImageCropperModule,
    FormatDatePipeSharedModule
  ],
  declarations: [ProfilPage]
})
export class ProfilPageModule {}
