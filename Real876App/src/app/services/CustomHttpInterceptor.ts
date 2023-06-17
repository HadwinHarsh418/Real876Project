import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { tap } from 'rxjs/operators';
import { AuthenticationService } from './authentication.Service';
import { environment } from 'src/environments/environment';
export const InterceptorSkipHeader = 'X-Skip-Interceptor';
export const InterceptorSkipAuthHeader = 'X-SkipAuth-Interceptor';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  /**
   *
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _authenticationService: AuthenticationService) { }

  /**
   * Add auth header with jwt if user is logged in and request is to api url
   * @param request
   * @param next
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this._authenticationService.currentUser;
    const isLoggedIn = currentUser;
    const isApiUrl = request.url.startsWith(environment.url);
    console.log(isApiUrl);
    console.log(isLoggedIn);
    
    if (isApiUrl) {
      if (isLoggedIn) {
        request = request.clone({
          setHeaders: {
            Authorization: `${currentUser}`
          }
        });
      } else if (this._authenticationService.tempToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `${this._authenticationService.tempToken}`
          }
        });
      }
      if (request.headers.has(InterceptorSkipHeader)) {
        request = request.clone({ headers: request.headers.delete(InterceptorSkipHeader) });
      }
    }

    return next.handle(request).pipe(
      tap(ev => {
        if (ev instanceof HttpResponse) {
          if (ev.status == 200 && ev.body.auth == false) {
            this._authenticationService.logout();
          }
        }
      })
    );
  }
}
