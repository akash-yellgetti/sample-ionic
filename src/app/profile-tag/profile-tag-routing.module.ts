import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileTagPage } from './profile-tag.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileTagPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileTagPageRoutingModule {}
