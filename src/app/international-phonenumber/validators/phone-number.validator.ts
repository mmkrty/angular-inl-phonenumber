import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as lpn from 'google-libphonenumber';

const phoneUtil = lpn.PhoneNumberUtil.getInstance();

export function phoneNumberValidator(countryCode: any): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {


        const phoneNumber = control.value;
        const selectedCountryCode = countryCode;

        if (!phoneNumber || !selectedCountryCode) {
            return null; // Return null for valid case
        }

        const formattedPhoneNumber = formatPhoneNumber(phoneNumber, selectedCountryCode);
        const isValid = isValidPhoneNumber(formattedPhoneNumber, selectedCountryCode);

        console.log('Validator', isValid)
        if (!isValid) {
            return { invalidPhoneNumber: true }; // Return error object for invalid case
        }

        return null; // Return null for valid case
    };
}

function formatPhoneNumber(phoneNumber: string, countryCode: string): string {
    try {
        const parsedNumber = getParsedNumber(phoneNumber, countryCode);
        return phoneUtil.format(parsedNumber, lpn.PhoneNumberFormat.E164);
    } catch (e) {
        console.log(e);
        return phoneNumber;
    }
}

function isValidPhoneNumber(phoneNumber: string, countryCode: string): boolean {
    try {
        const parsedNumber = getParsedNumber(phoneNumber, countryCode);
        return phoneUtil.isValidNumber(parsedNumber);
    } catch (e) {
        console.log(e);
        return false;
    }
}

function getParsedNumber(phoneNumber: string, countryCode: string): lpn.PhoneNumber {
    let number: lpn.PhoneNumber | undefined = undefined;
    try {
        number = phoneUtil.parse(phoneNumber, countryCode.toUpperCase());
    } catch (e) {
        console.log(e);
    }
    return number!;
}
