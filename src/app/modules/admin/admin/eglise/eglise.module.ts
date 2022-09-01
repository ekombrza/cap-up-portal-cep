import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EglisePageRoutingModule } from './eglise-routing.module';

import { EglisePage } from './eglise.page';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChurchResponsablesComponent } from './church-responsables/church-responsables.component';
import { ChurchResponsableInvitedComponent } from './church-responsable-invited/church-responsable-invited.component';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormatDatePipeSharedModule } from 'src/@ekbz/pipes/format-date/format-date-pipe-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EglisePageRoutingModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    FormatDatePipeSharedModule
    
  ],
  declarations: [EglisePage, ChurchResponsablesComponent, ChurchResponsableInvitedComponent]
})
export class EglisePageModule {}
