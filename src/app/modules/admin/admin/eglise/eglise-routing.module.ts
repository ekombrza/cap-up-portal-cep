import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EglisePage } from './eglise.page';

const routes: Routes = [
  {
    path: '',
    component: EglisePage
  },
  {
    path: 'eglise-update',
    loadChildren: () => import('./eglise-update/eglise-update.module').then( m => m.EgliseUpdatePageModule)
  },
  {
    path: 'church-invitation',
    loadChildren: () => import('./church-invitation/church-invitation.module').then( m => m.ChurchInvitationPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EglisePageRoutingModule {}
