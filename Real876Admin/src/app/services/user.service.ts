import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = environment.apiUrl

  constructor(private http:HttpClient) { }

  addUser(body:any):Observable<any>{
    return this.http.post(`${this.apiUrl}addUSer`,body)
  }
  updateUser(body:any):Observable<any>{
    return this.http.post(`${this.apiUrl}updateUser`,body)
  }
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}getAllUsers`)
  }
  getUserById(id:any): Observable<any> {
    return this.http.get(`${this.apiUrl}getUserById/${id}`)
  }
  deleteUser(id:any): Observable<any> {
    return this.http.delete(`${this.apiUrl}delUser/${id}`)
  }
  inactiveUser(id:any): Observable<any> {
    return this.http.post(`${this.apiUrl}loginAccess`,id)
  }
  
}
