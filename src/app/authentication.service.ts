import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../environments/environment';

export interface UserDetails {
  _id: string;
  email: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private token: string;
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1]; // Payload — an encoded JSON object containing the data, the real body of the token
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'sign-up', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'sign-in', user);
  }

  public logout(): void {
    this.token = '';
    this.isLoggedIn.next(false);
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }

  public profile(): Observable<any> {
    return this.request('get', 'profile');
  }

  private saveToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('access_token');
    }
    return this.token;
  }

  private request(
    method: 'post' | 'get',
    type: 'sign-in' | 'sign-up' | 'profile',
    user?: TokenPayload,
  ): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.http.post(`${environment.api_uri}/auth/${type}`, user);
    } else {
      base = this.http.get(`${environment.api_uri}/auth/${type}`, {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      });
    }

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
          this.isLoggedIn.next(true);
        }
        return data;
      }),
    );

    return request;
  }
}
