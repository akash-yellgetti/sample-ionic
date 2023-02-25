import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegotpPage } from './regotp.page';

const routes: Routes = [
  {
    path: '',
    component: RegotpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegotpPageRoutingModule {}
