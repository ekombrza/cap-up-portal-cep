import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdfViewPagePageRoutingModule } from './pdf-view-page-routing.module';

import { PdfViewPagePage } from './pdf-view-page.page';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    PdfViewPagePageRoutingModule,
    PdfViewerModule
  ],
  declarations: [PdfViewPagePage]
})
export class PdfViewPagePageModule {}
