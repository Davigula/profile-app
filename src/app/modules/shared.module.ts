import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [
      CommonModule,
      RouterModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      FlexLayoutModule,
    ],
    declarations: [
    ],
    exports: [
      CommonModule,
      RouterModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,

      MaterialModule,
      FlexLayoutModule,
    ]
})
export class SharedModule { }
