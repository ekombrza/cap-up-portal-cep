import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilUpdatePage } from './profil-update.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilUpdatePageRoutingModule {}
