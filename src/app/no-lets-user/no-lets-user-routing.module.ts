import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoLetsUserPage } from './no-lets-user.page';

const routes: Routes = [
  {
    path: '',
    component: NoLetsUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoLetsUserPageRoutingModule {}
