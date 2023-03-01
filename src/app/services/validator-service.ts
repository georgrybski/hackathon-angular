import { Injectable } from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  private static http: HttpClient;
  constructor(http: HttpClient) {
    ValidatorService.http = http;
  }

  static loginUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const login = control.value;
      return ValidatorService.http.get<boolean>(`/api//login-available?login=${login}`).pipe(
        map(res => res ? { loginAlreadyExists: true } : null),
        catchError(() => of(null))
      );
    };
  }

  static passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }
}
