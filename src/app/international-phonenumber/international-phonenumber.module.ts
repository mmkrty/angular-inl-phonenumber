import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InterPhonenumberInputComponent } from './components/inter-phonenumber-input/inter-phonenumber-input.component';



@NgModule({
  declarations: [
    InterPhonenumberInputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    InterPhonenumberInputComponent
  ]
})
export class InternationalPhonenumberModule { }
