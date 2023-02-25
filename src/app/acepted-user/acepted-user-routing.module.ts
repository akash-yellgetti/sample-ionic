import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AceptedUserPage } from './acepted-user.page';

const routes: Routes = [
  {
    path: '',
    component: AceptedUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AceptedUserPageRoutingModule {}
