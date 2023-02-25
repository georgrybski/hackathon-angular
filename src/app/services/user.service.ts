import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {UserCreationData, UserUpdateData, UserViewData} from '../models/user-data.models';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { mapEmailProvidersToSelectItems, mapToUserViewData } from '../shared/utils';
import { SelectItem } from 'primeng/api';
import { SearchParameters } from '../models/searchParameters.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUserList(searchParameters: SearchParameters): Observable<UserViewData[]> {
    let queryParams = '';

    if (searchParameters) {
      queryParams = '?' + Object.keys(searchParameters)
        .filter(key => searchParameters[key] != null) // filter out null or undefined values
        .map(key => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(searchParameters[key]);
        }).join('&');
    }

    return this.http.get<any[]>(`${environment.API}${queryParams}`).pipe(
      map(users => users.map(user => mapToUserViewData(user)))
    );
  }

  getUsersEmailProviders(): Observable<SelectItem[]> {
    return this.http.get<string[]>(`${environment.API}/email-providers`).pipe(
      map(emailProviders => mapEmailProvidersToSelectItems(emailProviders)));
  }

  deleteUserById(id: number): Observable<any> {
    return this.http.delete(`${environment.API}/${id}`);
  }

  deleteUsersById(numbers: number[]): Observable<any> {
    return this.http.post(`${environment.API}/batch/delete`, numbers);
  }

  // getUser(id: number): Observable<UserViewData> {
  //   return this.http.get<any>(`${environment.API}/${id}`).pipe(
  //     map(user => mapToUserViewData(user)));
  // }
  //
  // getUserListByBirthMonth(month: number): Observable<UserViewData[]> {
  //   return this.http.get<any[]>(`${environment.API}/born-in/?month=${month}`).pipe(
  //     map(users => users.map(user => mapToUserViewData(user)))
  //   );
  // }
  //
  // getUserById(id: number): Observable<UserViewData>{
  //   return this.http.get<any>(`${environment.API}/${id}`).pipe(
  //     map(user => mapToUserViewData(user)));
  // }
  //
  // getUserByName(name: string): Observable<UserViewData[]> {
  //   return this.http.get<any[]>(`${environment.API}/name-contains/?string=${name}`).pipe(
  //     map(users => users.map(user => mapToUserViewData(user))));
  // }
  //
  // getUserByLogin(login: string): Observable<UserViewData[]> {
  //   return this.http.get<any[]>(`${environment.API}/login-contains/?string=${login}`).pipe(
  //     map(users => users.map(user => mapToUserViewData(user))));
  // }
  //
  // getUserByEmail(email: string): Observable<UserViewData[]> {
  //   return this.http.get<any[]>(`${environment.API}/email-contains/?string=${email}`).pipe(
  //     map(users => users.map(user => mapToUserViewData(user))));
  // }
  //
  createUser(userToBeCreated: UserCreationData): Observable<any> {
    return this.http.post(`${environment.API}`, userToBeCreated);
  }

  updateUser(userToBeEdited: UserUpdateData): Observable<any> {
    return this.http.put(`${environment.API}/${userToBeEdited.id}`, userToBeEdited);
  }
}
