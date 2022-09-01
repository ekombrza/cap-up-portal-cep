import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileExplorerComponent } from 'src/@ekbz/components/file-explorer/file-explorer.component';
import { AuthGuard } from 'src/app/models-services/auth/guards/auth.guard';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';
import { ResourcesRoutingResolveService } from './resources-routing-resolve.service';

import { ResourcesPage } from './resources.page';
import { FileRoutingResolveService } from './section-resource/file-section/file-section-update/file-routing-resolve.service';
import { FileSectionUpdateComponent } from './section-resource/file-section/file-section-update/file-section-update.component';
import { LecteurSeriesRoutingResolveService } from './section-resource/lecteur-series/lecteur-series-update/lecteur-series-routing-resolve.service';
import { LecteurSeriesUpdateComponent } from './section-resource/lecteur-series/lecteur-series-update/lecteur-series-update.component';
import { SectionsResourceRoutingResolveService } from './section-resource/sections-resource-routing-resolve.service';
import { UpdateComponent } from './section-resource/update/update.component';

const routes: Routes = [
  {
    path: '',
    component: ResourcesPage,
    canActivate: [AuthGuard],
  },
  {
    path: 'accessDenied',
    component: AccessDeniedComponent
  },
  
  {
    path: ':id/view',
    component: DetailComponent,
    resolve: {
      resource: ResourcesRoutingResolveService,
    },
    canActivate: [AuthGuard],
  },
  {
    path: ':id/view/edit',
    component: DetailComponent,
    resolve: {
      resource: ResourcesRoutingResolveService,
    },
    canActivate: [AuthGuard],
    data: { 
      authorities: ['Administrateur']
    }
  },
  {
    path: 'new',
    component: AddComponent,
    resolve: {
      resource: ResourcesRoutingResolveService,
    },
    canActivate: [AuthGuard],
    data: { 
      authorities: ['Administrateur']
    }
  },
  {
    path: ':id/edit',
    component: AddComponent,
    resolve: {
      resource: ResourcesRoutingResolveService,
    },
    canActivate: [AuthGuard],
    data: { 
      authorities: ['Administrateur']
    }
  },
  {
    path: ':id/section/new',
    component: UpdateComponent,
    resolve: {
      resource: ResourcesRoutingResolveService,
      sectionResource: SectionsResourceRoutingResolveService,
    },
    canActivate: [AuthGuard],
    data: { 
      authorities: ['Administrateur']
    }
  },
  {
    path: ':id/section/:idSection/edit',
    component: UpdateComponent,
    resolve: {
      resource: ResourcesRoutingResolveService,
      sectionResource: SectionsResourceRoutingResolveService,
    },
    canActivate: [AuthGuard],
    data: { 
      authorities: ['Administrateur']
    }
  },
  {
    path: ':id/section/:idSection/file/new',
    component: FileSectionUpdateComponent,
    resolve: {
      sectionResource: SectionsResourceRoutingResolveService,
      file: FileRoutingResolveService
    },
    canActivate: [AuthGuard],
    data: { 
      authorities: ['Administrateur']
    }
  },
  {
    path: ':id/section/:idSection/file/:idFile/edit',
    component: FileSectionUpdateComponent,
    resolve: {
      //resource: ResourcesRoutingResolveService,
      sectionResource: SectionsResourceRoutingResolveService,
      file: FileRoutingResolveService
    },
    canActivate: [AuthGuard],
    data: { 
      authorities: ['Administrateur']
    }
  },
  {
    path: ':id/section/:idSection/lecteur-serie/new',
    component: LecteurSeriesUpdateComponent,
    resolve: {
      sectionResource: SectionsResourceRoutingResolveService,
      lecteurSeries: LecteurSeriesRoutingResolveService
    },
    canActivate: [AuthGuard],
    data: { 
      authorities: ['Administrateur']
    }
  },
  {
    path: ':id/section/:idSection/lecteur-serie/:idLecteurSeries/edit',
    component: LecteurSeriesUpdateComponent,
    resolve: {
      sectionResource: SectionsResourceRoutingResolveService,
      lecteurSeries: LecteurSeriesRoutingResolveService
    },
    canActivate: [AuthGuard],
    data: { 
      authorities: ['Administrateur']
    }
  },
  {
    path: 'file-explorer',
    component: FileExplorerComponent,
    canActivate: [AuthGuard],
    data: { 
      authorities: ['Administrateur']
    }
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourcesPageRoutingModule {}
