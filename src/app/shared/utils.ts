import { UserCreationData, UserUpdateData, UserViewData } from '../models/user-data.models';
import { SelectItem } from 'primeng/api';
import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';


export function mapToUserViewData(user: any): UserViewData {
  return {
    id: user.id,
    name: user.name,
    login: user.login,
    email: user.email,
    birthDate: user.birthDate ? new Date(user.birthDate) : undefined,
    creationTime: user.creationTime ? new Date(user.creationTime) : undefined,
    updateTime: user.updateTime ? new Date(user.updateTime) : undefined
  };
}

export function mapEmailProvidersToSelectItems(emailProviders: string[]): SelectItem[] {
  return emailProviders.map(emailProvider => {
    return {label: emailProvider, value: emailProvider};
  });
}

export function mapFormValuesToUser(formValues: FormGroup): UserCreationData | UserUpdateData {
  const id = formValues.get('id').value;
  const name = formValues.get('name').value;
  const login = formValues.get('login').value;
  const email = formValues.get('email').value;
  const password = formValues.get('password').value;
  const birthDate = formValues.get('birthDate').value;

  if (id) {
    return { id, name, login, email, password, birthDate };
  } else {
    return { name, login, email, password, birthDate };
  }
}

export function getMonthsSelectItems(): SelectItem[] {
  return [
    {label: 'Select a Month', value: null},
    {label: 'January', value: 1},
    {label: 'February', value: 2},
    {label: 'March', value: 3},
    {label: 'April', value: 4},
    {label: 'May', value: 5},
    {label: 'June', value: 6},
    {label: 'July', value: 7},
    {label: 'August', value: 8},
    {label: 'September', value: 9},
    {label: 'October', value: 10},
    {label: 'November', value: 11},
    {label: 'December', value: 12}
  ];
}



export function formatDate(date: Date): string {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}


// export function confirmPasswordValidator(controlName: string, matchingControlName: string): (formGroup: FormGroup) => void {
//   return (formGroup: FormGroup) => {
//     const control = formGroup.controls[controlName];
//     const matchingControl = formGroup.controls[matchingControlName];
//     if (
//       matchingControl.errors &&
//       !matchingControl.errors.confirmPasswordValidator
//     ) {
//       return;
//     }
//     if (control.value !== matchingControl.value) {
//       matchingControl.setErrors({ confirmPasswordValidator: true });
//     } else {
//       matchingControl.setErrors(null);
//     }
//   };

export const passwordMatchingValidatior: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password?.value === confirmPassword?.value ? null : { notmatched: true };
};

