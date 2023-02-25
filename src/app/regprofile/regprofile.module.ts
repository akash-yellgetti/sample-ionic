import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegprofilePageRoutingModule } from './regprofile-routing.module';

import { RegprofilePage } from './regprofile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegprofilePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegprofilePage]
})
export class RegprofilePageModule {}
