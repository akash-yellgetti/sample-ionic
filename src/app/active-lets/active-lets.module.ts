import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActiveLetsPageRoutingModule } from './active-lets-routing.module';

import { ActiveLetsPage } from './active-lets.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveLetsPageRoutingModule
  ],
  declarations: [ActiveLetsPage]
})
export class ActiveLetsPageModule {}
