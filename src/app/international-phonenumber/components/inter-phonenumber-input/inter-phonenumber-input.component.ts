import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { phoneNumberValidator, formatPhoneNumber } from '../../validators/phone-number.validator';
import { Countries } from '../../data/countries';
import * as lpn from 'google-libphonenumber';

interface Country {
  name: string;
  dial_code: string;
  emoji?: string;
  code: string;
}

@Component({
  selector: 'app-inter-phonenumber-input',
  templateUrl: './inter-phonenumber-input.component.html',
  styleUrls: ['./inter-phonenumber-input.component.scss']
})
export class InterPhonenumberInputComponent implements OnInit, OnChanges {
  @Output() valid: EventEmitter<boolean> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() blur: EventEmitter<boolean> = new EventEmitter();

  @Input() inputNgModel: string | null = null;
  @Output() inputNgModelChange = new EventEmitter<string>();

  @Input() defaultCountryCode: string = 'DE';
  @Input() formControlValidation = true;
  @Input() showValidationFeedback = true;

  public internalFormControl = new FormControl<any>('', { validators: [] });
  public phoneNumberCountry: Country | null = null;
  public selectedCountry: Country | null = null;
  countries: Country[] = Countries;

  defaultCountry: Country = this.setDefaultCountry();
  phoneUtil: any = lpn.PhoneNumberUtil.getInstance();

  selectedCountryIndex = 0;

  ngOnInit(): void {
    this.internalFormControl.valueChanges.subscribe((event) => {
      if (this.internalFormControl) {
        this.valid.emit(this.internalFormControl.valid);

        this.detectPhoneNumberCountry(event)

        let valueToSet = event

        if (this.inputNgModel !== null) {
          this.inputNgModelChange.emit(valueToSet);
        }

        if (!event && this.phoneNumberCountry) {
          this.internalFormControl.setValue(this.phoneNumberCountry.dial_code);
        }
      }
    });

    this.detectPhoneNumberCountry(this.internalFormControl.value);
    this.updateSelectedCountry();
    this.initializeValidator();
  }

  ngOnChanges(): void {
    if (this.inputNgModel !== null && this.inputNgModel !== this.internalFormControl.value?.e164Number) {
      console.log('ngOnChanges')
      this.setPhonenumber(this.inputNgModel?.toString());
    }
    // this.detectPhoneNumberCountry(this.internalFormControl.value);
  }

  setPhonenumber(phonenumber: string): void {
    console.log("setPhonenumber triggered")
    this.internalFormControl.setValue(phonenumber);
  }

  parsePhoneNumber(phoneNumber: string): string {
    if (!this.selectedCountry) {
      return phoneNumber;
    }
    const existingDialCode = this.phoneNumberCountry!.dial_code;
    const cleanedPhoneNumber = phoneNumber.replace(existingDialCode, '');
    return this.selectedCountry.dial_code + cleanedPhoneNumber;
  }

  onCountrySelectionChange(): void {
    this.selectedCountry = this.countries[this.selectedCountryIndex];
    this.setPhonenumber(this.parsePhoneNumber(this.internalFormControl.value));
  }

  public trackBlur(): void {
    this.blur.emit(this.internalFormControl?.valid);
  }

  onPhoneNumberChange(): void {
    const phoneNumber = this.internalFormControl.value;
    const currentPhoneCountryCode = this.phoneNumberCountry?.code;
    console.log(currentPhoneCountryCode)

    if (!phoneNumber || !currentPhoneCountryCode) {
      return;
    }

    const formattedPhoneNumber = formatPhoneNumber(phoneNumber, currentPhoneCountryCode);
    console.log('Formatted phone number', formattedPhoneNumber);
    this.inputNgModelChange.emit(formattedPhoneNumber);
  }

  private detectPhoneNumberCountry(phoneNumber: string): void {
    if (!phoneNumber) { this.phoneNumberCountry = this.defaultCountry };

    this.countries.forEach((country) => {
      if (phoneNumber.startsWith(country.dial_code)) {
        this.phoneNumberCountry = country;
      }
    })
  }


  private updateSelectedCountry(): void {
    if (this.phoneNumberCountry) {
      this.selectedCountryIndex = this.countries.findIndex(
        (country) => country.code === this.phoneNumberCountry!.code
      );
    }
  }

  private setDefaultCountry(): Country {
    const defaultCountry = {
      "name": "Germany",
      "dial_code": "+49",
      "code": "DE",
      "emoji": "🇩🇪"
    };
    const foundCountry = this.countries.find(country => country.code === this.defaultCountryCode);
    return foundCountry ? foundCountry : defaultCountry;
  }

  private initializeValidator(): void {
    const selectedCountryCode = this.phoneNumberCountry?.code;
    if (selectedCountryCode) {
      const validatorFns = [Validators.required, phoneNumberValidator(selectedCountryCode)];
      this.internalFormControl.setValidators(validatorFns);
    }
    this.internalFormControl.updateValueAndValidity();
  }
}
