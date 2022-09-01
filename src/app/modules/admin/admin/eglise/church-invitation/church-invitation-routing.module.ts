import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChurchInvitationPage } from './church-invitation.page';

const routes: Routes = [
  {
    path: '',
    component: ChurchInvitationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChurchInvitationPageRoutingModule {}
