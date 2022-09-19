import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeFilePage } from './type-files.page';
import { TypeFilesResolver } from './typeFiles.resolvers';

const routes: Routes = [
  {
    path: '',
    component: TypeFilePage,
    resolve  : {
      typeFiles  : TypeFilesResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypeFilesPageRoutingModule {}
