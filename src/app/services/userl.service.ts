import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UserViewData } from '../models/user-view-data';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {map, tap} from 'rxjs/operators';
import { mapToUserViewData } from '../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class UserlService {
  constructor(private http: HttpClient) { }

  getUserList(): Observable<UserViewData[]> {
    return this.http.get<any[]>(environment.API).pipe(
      map(users => users.map(user => mapToUserViewData(user)))
    );
  }

  getUser(id: number): Observable<UserViewData> {
    return this.http.get<any>(`${environment.API}/${id}`).pipe(
      map(user => mapToUserViewData(user)));
  }

  getUserListByBirthMonth(month: number): Observable<UserViewData[]> {
    return this.http.get<any[]>(`${environment.API}/born-in/?month=${month}`).pipe(
      map(users => users.map(user => mapToUserViewData(user)))
    );
  }

  getUserById(id: string): Observable<UserViewData>{
    return this.http.get<any>(`${environment.API}/${id}`).pipe(
      map(user => mapToUserViewData(user)));
  }

  getUserByName(name: string): Observable<UserViewData[]> {
    return this.http.get<any[]>(`${environment.API}/name-contains/?string=${name}`).pipe(
      map(users => users.map(user => mapToUserViewData(user))));
  }

  getUserByLogin(login: string): Observable<UserViewData[]> {
    return this.http.get<any[]>(`${environment.API}/login-contains/?string=${login}`).pipe(
      map(users => users.map(user => mapToUserViewData(user))));
  }

  getUserByEmail(email: string): Observable<UserViewData[]> {
    return this.http.get<any[]>(`${environment.API}/email-contains/?string=${email}`).pipe(
      map(users => users.map(user => mapToUserViewData(user))));
  }

  getUsersEmailProviders(): Observable<string[]> {
    return this.http.get(`${environment.API}/email-providers`).pipe(
      tap(response => console.log(response)),
      map(response => response as string[])
    );
  }
}
