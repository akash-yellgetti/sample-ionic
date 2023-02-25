import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoLetsUserPageRoutingModule } from './no-lets-user-routing.module';

import { NoLetsUserPage } from './no-lets-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoLetsUserPageRoutingModule
  ],
  declarations: [NoLetsUserPage]
})
export class NoLetsUserPageModule {}
