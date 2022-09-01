import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FileExplorerComponent } from './file-explorer/file-explorer.component';

import { VimeModule } from '@vime/angular';
import { SwiperModule } from 'swiper/angular';
import { QuillModule } from 'ngx-quill';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { DetailComponent } from 'src/app/modules/admin/apps/ressources/resources/detail/detail.component';
import { AddComponent } from 'src/app/modules/admin/apps/ressources/resources/add/add.component';
import { UpdateComponent } from 'src/app/modules/admin/apps/ressources/resources/section-resource/update/update.component';
import { FileSectionUpdateComponent } from 'src/app/modules/admin/apps/ressources/resources/section-resource/file-section/file-section-update/file-section-update.component';
import { LecteurSeriesUpdateComponent } from 'src/app/modules/admin/apps/ressources/resources/section-resource/lecteur-series/lecteur-series-update/lecteur-series-update.component';
import { AccessDeniedComponent } from 'src/app/modules/admin/apps/ressources/resources/access-denied/access-denied.component';



@NgModule({
  declarations: [HeaderComponent, DetailComponent, AddComponent, UpdateComponent, FileSectionUpdateComponent, LecteurSeriesUpdateComponent, FileExplorerComponent, AccessDeniedComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    MatIconModule,
    MatInputModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    VimeModule,
    SwiperModule,
    QuillModule.forRoot(),
  ],
  exports: [HeaderComponent,DetailComponent, AddComponent, UpdateComponent, FileSectionUpdateComponent, LecteurSeriesUpdateComponent, FileExplorerComponent, AccessDeniedComponent]
})
export class SharedComponentsModule { }
