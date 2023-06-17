import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiUrl = environment.apiUrl

  constructor(private http:HttpClient) { }

  addProduct(body:any): Observable<any> {
    return this.http.post(`${this.apiUrl}addProduct`,body)
  }
  
  getProducts(val:any): Observable<any> {
    return this.http.post(`${this.apiUrl}getProducts`,val)
  }
  getProductsById(id): Observable<any> {
    return this.http.get(`${this.apiUrl}getProductBymetaId/${id}`)
  }

  updateProduct(body:any): Observable<any>{
    return this.http.post(`${this.apiUrl}updateProduct`,body)
  }
  deleteProduct(body:any): Observable<any>{
    return this.http.delete(`${this.apiUrl}delProduct/${body}`)
  }
  bulkDelete(body:any): Observable<any>{
    return this.http.post(`${this.apiUrl}multipleDelete`,body)
  }

}
