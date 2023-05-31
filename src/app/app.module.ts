import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { InternationalPhonenumberModule } from './international-phonenumber/international-phonenumber.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    InternationalPhonenumberModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
