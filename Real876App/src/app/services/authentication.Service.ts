import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EncryptionService } from './encryptionservice';


const TOKEN_KEY = 'Real876-admin-auth-token';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public currentUser!: Observable<any>;

    //private
    private currentUserSubject!: BehaviorSubject<any>;
    public profilePicUpdate = new BehaviorSubject<boolean>(false);
  
    loggedOut: boolean | undefined;
    tempToken: string = '';
  
    get isClient() {
        return this.currentUser && this.currentUserSubject.value.role === '2';
      }
    /**
     *
     * @param {HttpClient} _http
     * @param {ToastrService} _toastrService
   */
  constructor(
    private _http: HttpClient,
    public toastr: ToastrService,
    private router: Router,
    private encryptionService:EncryptionService
  ) {
    this.checkToken();
  }

  checkToken() {
    let locToken = this.encryptionService.decode(localStorage.getItem(TOKEN_KEY));
    if (locToken) {
      this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(locToken));
      this.currentUser = this.currentUserSubject.asObservable();
    } else {
      this.currentUserSubject = new BehaviorSubject<any>(null);
      this.currentUser = this.currentUserSubject.asObservable();
    }
  }

  
  /**
   * User logout
   *
   */
  logout() {
    // console.log('UZ TOKEN :-',localStorage.getItem(TOKEN_KEY));
    
    

    // remove user from local storage to log user out
    // localStorage.removeItem(TOKEN_KEY);
    // notify
    //  localStorage.clear();
    localStorage.removeItem(TOKEN_KEY)
    localStorage.clear()
    this.router.navigate(['/']);
    this.currentUserSubject.next(null);
    // clearBalance stored balance
    // this._userBalanceService.resetBalance();
    // set logout flag
    this.loggedOut = true;

  }

  setLogin(user:any) {
    if (user && user.token) {
      localStorage.setItem(TOKEN_KEY, this.encryptionService.encode(JSON.stringify(user)));
      this.currentUserSubject.next(user);
      this.loggedOut = false;
    }
  }

  errorToaster(data: any, toToast = true) {
    if (data.error && data.msg) {
      if (data.auth == false) {
        if (!this.loggedOut) {
          // show toaster for session out;
          if (toToast) {
            this.toastr.error(data.msg);
          }
        }
        this.loggedOut = true;
      } else {
        // show default retuned error;
        if (toToast) {
          this.toastr.error(data.msg);
        }
      }
    }
  }
}
