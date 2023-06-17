import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil, first } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AuthenticationService } from 'app/auth/service';
import { CoreConfigService } from '@core/services/config.service';
import { Role, User } from 'app/auth/models';
import { TranslateService } from '@ngx-translate/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DataService } from 'app/auth/service/data.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoginService } from 'app/services/login.service';

@Component({
  selector: 'app-auth-login-v2',
  templateUrl: './auth-login-v2.component.html',
  styleUrls: ['./auth-login-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthLoginV2Component implements OnInit {
  //  Public
  public coreConfig: any;
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;
  public mainlogo = '';
  loadingSecurityData: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;
  is_captcha: boolean;
  isRecaptcha: boolean;
  showAuthTokenModal: boolean = false;
  sixDigitCode: any;
  loggedUser: User;

  ip_address: string = "";
  current_city: string = "";
  deviceInfo: any;
  antiphishing: boolean;
  encodedemail: string = '';

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private dataservice: DataService,
    private translateService: TranslateService,
    private _authenticationService: AuthenticationService,
    private toastr: ToastrManager,
    private apiService:LoginService

  ) {
    this.mainlogo = this._coreConfigService.mainLogo;

    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
    // this.getCurrentIP();
    if(!this.dataservice.geodata) {
      this.dataservice.getGeoDevData();
    } 
    if(!this.dataservice.devicedata) {
      this.dataservice.getDeviceData();
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  resolved(captchaResponse: string) {
    this.is_captcha = false;
    this.isRecaptcha = true;
    this.error = '';
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;
    // let locData:any = this.dataservice.getgeoDevObject();
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    if (!this.isRecaptcha && location.href.indexOf('localhost:4200') == -1) {
      this.is_captcha = true;
      this.translateService.get('login.captchaReq').subscribe(
        res => {
          this.error = res;
        }
      )
      return;
    }
    this.loading = true;
    this.apiService.login(this.loginForm.value).subscribe((res:any)=>{
      if(!res.error){
        this._router.navigate(['/dashboard']);
        res.body.role = 'Admin'
        this._authenticationService.setLogin(res.body)
        this.loading = false;
        this.toastr.successToastr(res.msg)
      }
      else
      {
        this.loading=false;
        this.toastr.errorToastr('Email does not exist')
      }
    },error=>{
      this.loading=false;
        this.toastr.errorToastr('Something went wrong Please try again later!')
    })

    }

  toCheckAuht() {
    if (this.loggedUser.two_fa_actived === '0' || location.href.indexOf('localhost:4200') > -1 || location.href.indexOf('localhost:2100') > -1) {
      let locData:any = {};
      locData = this.dataservice.getgeoDevObject();
      this.loggedUser = this.loggedUser;
      locData.userID = this.loggedUser._id;
      this._authenticationService.tempToken = this.loggedUser.token;
      // this.loginLogs(locData);
      this._authenticationService.setLogin(this.loggedUser);
      this._router.navigate(['/dashboard']);
    }
    else {
      this._authenticationService.tempToken = this.loggedUser.token;
      this.loggedUser = this.loggedUser;
      this.showAuthTokenModal = true;
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // redirect to home if already logged in
    if (this._authenticationService.currentUserValue) {
      this._router.navigate(['/dashboard']);
    }
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }


  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
