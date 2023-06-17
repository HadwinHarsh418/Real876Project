import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl = environment.apiUrl

  constructor(private http:HttpClient) { }

  login(body:any): Observable<any> {
    return this.http.post(`${this.apiUrl}userLogin`,body)
    }
}
