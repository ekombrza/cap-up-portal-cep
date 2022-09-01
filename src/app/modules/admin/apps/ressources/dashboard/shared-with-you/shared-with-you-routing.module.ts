import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedWithYouPage } from './shared-with-you.page';

const routes: Routes = [
  {
    path: '',
    component: SharedWithYouPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedWithYouPageRoutingModule {}
