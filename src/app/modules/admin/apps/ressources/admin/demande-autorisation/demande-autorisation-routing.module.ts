import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemandeAutorisationPage } from './demande-autorisation.page';

const routes: Routes = [
  {
    path: '',
    component: DemandeAutorisationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemandeAutorisationPageRoutingModule {}
