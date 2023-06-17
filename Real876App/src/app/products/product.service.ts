import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiUrl = environment.url

  constructor(private http:HttpClient) { }

  addProduct(body:any): Observable<any> {
    return this.http.post(`${this.apiUrl}addProduct`,body)
  }
  
  getProducts(search?:any): Observable<any> {
    var t = localStorage.getItem("token_Key")
    var c = JSON.parse(t || '')
    let headers = new Headers();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': c
      })
    };
    return this.http.post(`${this.apiUrl}getProductByUserId`,search,httpOptions)
  }
  getProductsById(id:any):Observable<any>{
    return this.http.get(`${this.apiUrl}getProductBymetaId/${id}`)
  }

  updateProduct(body:any): Observable<any>{
    return this.http.post(`${this.apiUrl}updateProduct`,body)
  }
  deleteProduct(body:any): Observable<any>{
    return this.http.delete(`${this.apiUrl}delProduct/${body}`)
  }
  bulkUpload(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}importDocument`,data)
  }

}
