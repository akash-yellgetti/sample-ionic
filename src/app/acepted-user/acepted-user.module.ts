import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AceptedUserPageRoutingModule } from './acepted-user-routing.module';

import { AceptedUserPage } from './acepted-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AceptedUserPageRoutingModule
  ],
  declarations: [AceptedUserPage]
})
export class AceptedUserPageModule {}
