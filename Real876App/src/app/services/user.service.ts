import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserSession } from '../models/loginResponse';
import { AuthService } from './auth.service';
import { InterceptorSkipHeader } from './CustomHttpInterceptor';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl: string;
  tokenKey!: UserSession;

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {
    this.apiUrl = environment.url
    this.getToken();
  }

  login(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/login`, body)
  }
  register(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/register`, body)
  }
  verifyEmail(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}confirmation/${body}`, '')
  }

  setToken(loginResponse: UserSession) {
    localStorage.setItem('token_Key', JSON.stringify(loginResponse));
    this.getToken();
  }
  getToken(): any {
    let userData = window.localStorage.getItem('token_Key');
    if (userData) {
      this.tokenKey = JSON.parse(userData);
      return this.tokenKey
    }
  }

  isLogined() {
    return localStorage.getItem('token_Key') != null;
  }
  logout() {
    localStorage.removeItem('token_Key');
    localStorage.removeItem('viewedBanner');
    this.router.navigate(['/']);
  }
  socialLoginMail(body:any): Observable<any>{
    return this.http.post(`${this.apiUrl}auth/socialLogin`,body)
  }


}
