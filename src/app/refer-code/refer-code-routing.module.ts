import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReferCodePage } from './refer-code.page';

const routes: Routes = [
  {
    path: '',
    component: ReferCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferCodePageRoutingModule {}
