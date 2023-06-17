import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  apiUrl = environment.apiUrl

  constructor(private http:HttpClient) { }

  getAllCountry(): Observable<any> {
    return this.http.get(`${this.apiUrl}getCountryList`)
    }
}
