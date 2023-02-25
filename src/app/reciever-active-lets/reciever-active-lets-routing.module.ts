import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecieverActiveLetsPage } from './reciever-active-lets.page';

const routes: Routes = [
  {
    path: '',
    component: RecieverActiveLetsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecieverActiveLetsPageRoutingModule {}
