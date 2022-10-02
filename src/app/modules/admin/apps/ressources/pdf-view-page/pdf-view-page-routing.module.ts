import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PdfViewPagePage } from './pdf-view-page.page';

const routes: Routes = [
  {
    path: '',
    component: PdfViewPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PdfViewPagePageRoutingModule {}
