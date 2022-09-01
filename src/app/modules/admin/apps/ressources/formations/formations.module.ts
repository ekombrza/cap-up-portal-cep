import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormationsPageRoutingModule } from './formations-routing.module';

import { FormationsPage } from './formations.page';
import { SharedComponentsModule } from 'src/@ekbz/components/shared-components.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsModule,
    FormationsPageRoutingModule
  ],
  declarations: [FormationsPage]
})
export class FormationsPageModule {}
