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
export class AuthService {
  private token: string;

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
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }

  public profile(): Observable<any> {
    return this.request('get', 'profile');
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private saveToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.token = token;
  }

  public getToken(): string {
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
        }
        return data;
      }),
    );

    return request;
  }
}
