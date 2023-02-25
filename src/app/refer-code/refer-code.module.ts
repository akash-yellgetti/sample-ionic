import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReferCodePageRoutingModule } from './refer-code-routing.module';

import { ReferCodePage } from './refer-code.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReferCodePageRoutingModule
  ],
  declarations: [ReferCodePage]
})
export class ReferCodePageModule {}
