import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as lpn from 'google-libphonenumber';

interface Country {
  name: string;
  dial_code: string;
  emoji: string;
  code: string;
}

@Component({
  selector: 'app-inter-phonenumber-input',
  templateUrl: './inter-phonenumber-input.component.html',
  styleUrls: ['./inter-phonenumber-input.component.css']
})
export class InterPhonenumberInputComponent implements OnInit, OnChanges {
  public internalFormControl = new FormControl<any>('', { validators: Validators.required });
  public selectedCountry!: Country;

  @Output() valid: EventEmitter<boolean> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() blur: EventEmitter<boolean> = new EventEmitter();

  @Input() inputNgModel: string | null = null;
  @Output() inputNgModelChange = new EventEmitter<string>();

  @Input() formControlValidation = true;
  @Input() showValidationFeedback = true;

  phoneUtil: any = lpn.PhoneNumberUtil.getInstance();

  countries: Country[] = [
    {
      'name': 'Germany',
      'dial_code': '+49',
      'emoji': '🇩🇪',
      'code': 'DE'
    },
    {
      'name': 'Austria',
      'dial_code': '+43',
      'emoji': '🇦🇹',
      'code': 'AT'
    },
    {
      'name': 'Switzerland',
      'dial_code': '+41',
      'emoji': '🇨🇭',
      'code': 'CH'
    },
    {
      'name': 'Poland',
      'dial_code': '+48',
      'emoji': '🇵🇱',
      'code': 'PL'
    },
    {
      'name': 'Turkey',
      'dial_code': '+90',
      'emoji': '🇹🇷',
      'code': 'TR'
    },
  ]

  selectedIndex = 0;


  ngOnInit(): void {
    this.internalFormControl.valueChanges.subscribe((event) => {
      if (this.internalFormControl) {
        this.valid.emit(this.internalFormControl.valid);

        let valueToSet = '';
        if (event?.e164Number) {
          valueToSet = event?.e164Number;
        } else if (event?.number) {
          valueToSet = event?.number;
        }
        else if (typeof event === 'string') {
          valueToSet = event;
        }

        if (event?.number?.includes('+')) {
          this.internalFormControl.setValue(this.internalFormControl.value.nationalNumber);
        }

        if (this.inputNgModel !== null) {
          this.inputNgModelChange.emit(valueToSet);
        }
      }
    });
  }

  ngOnChanges(): void {
    if (this.inputNgModel !== null && this.inputNgModel !== this.internalFormControl.value?.e164Number) {
      this.setPhonenumber(this.inputNgModel?.toString());
    }
  }

  setPhonenumber(phonenumber: string): void {
    this.internalFormControl.setValue(phonenumber);
  }

  onCountrySelectionChange(): void {
    this.selectedCountry = this.countries[this.selectedIndex];
    this.setPhonenumber(this.parsePhoneNumber(this.internalFormControl.value));
  }

  parsePhoneNumber(phoneNumber: string): string {
    if (!this.selectedCountry) {
      return phoneNumber;
    }
    const existingDialCode = this.selectedCountry.dial_code;
    const cleanedPhoneNumber = phoneNumber.replace(existingDialCode, '');
    return this.selectedCountry.dial_code + cleanedPhoneNumber;
  }

  public trackBlur(): void {
    this.blur.emit(this.internalFormControl?.valid);
  }

  onPhoneNumberChange(): void {
    const phoneNumber = this.internalFormControl.value;
    const selectedCountryCode = this.selectedCountry?.code;

    if (!phoneNumber || !selectedCountryCode) {
      return;
    }

    const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber, selectedCountryCode);
    const isValid = this.isValidPhoneNumber(formattedPhoneNumber, selectedCountryCode);

    if (isValid) {
      // Emit the valid phone number
      this.inputNgModelChange.emit(formattedPhoneNumber);
    } else {
      // Emit null for an invalid phone number
      this.inputNgModelChange.emit(undefined);
    }

    this.valid.emit(isValid);
  }

  private formatPhoneNumber(phoneNumber: string, countryCode: string): string {
    try {
      const parsedNumber = this.getParsedNumber(phoneNumber, countryCode);
      return this.phoneUtil.format(parsedNumber, lpn.PhoneNumberFormat.E164);
    } catch (e) {
      console.log(e);
      return phoneNumber;
    }
  }

  private isValidPhoneNumber(phoneNumber: string, countryCode: string): boolean {
    try {
      const parsedNumber = this.getParsedNumber(phoneNumber, countryCode);
      return this.phoneUtil.isValidNumber(parsedNumber);
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  private getParsedNumber(
    phoneNumber: string,
    countryCode: string
  ): lpn.PhoneNumber {
    let number: lpn.PhoneNumber | undefined = undefined;
    try {
      number = this.phoneUtil.parse(phoneNumber, countryCode.toUpperCase());
    } catch (e) {
      console.log(e)
    }
    return number!;
  }
}
