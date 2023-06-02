import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'phonenumber-input';
  phone: string = ''
  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      phone: new FormControl('')
    });
  }

  onSubmit(): void {
    console.log('Form submitted!');
    console.log('Phone:', this.form.value.phone);
  }
}
