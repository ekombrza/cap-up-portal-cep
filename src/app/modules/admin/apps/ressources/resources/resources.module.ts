import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResourcesPageRoutingModule } from './resources-routing.module';

import { ResourcesPage } from './resources.page';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatExpansionModule, MAT_EXPANSION_PANEL_DEFAULT_OPTIONS} from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { QuillModule } from 'ngx-quill';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedComponentsModule } from 'src/@ekbz/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatIconModule,
    MatInputModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    ResourcesPageRoutingModule,
    SharedComponentsModule,
    QuillModule.forRoot()
  ],
  declarations: [ResourcesPage],
  providers: [
    {
        provide: MAT_EXPANSION_PANEL_DEFAULT_OPTIONS,
        useValue: {
            hideToggle: true,
            expandedHeight: '80px',
            collapsedHeight: '70px'
        }
    }
]
})
export class ResourcesPageModule {}
