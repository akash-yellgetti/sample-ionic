import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegotpPageRoutingModule } from './regotp-routing.module';

import { RegotpPage } from './regotp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegotpPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegotpPage]
})
export class RegotpPageModule {}
