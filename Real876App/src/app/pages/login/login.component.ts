
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoggedInReponse, UserSession } from 'src/app/models/loginResponse';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from 'src/app/services/authentication.Service';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { SocialUser } from 'src/app/models/socialUser';

declare var $: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [SocialAuthService]

})
export class LoginComponent implements OnInit {
  cookieEamil!: string;
  cookiePassword!: string;
  loginForm!: FormGroup;
  submitted!: boolean;
  isBtnDisabled!: boolean;
  loginResponse!: UserSession;
  show!: boolean;
  checked: boolean = false;
  socialUser!: SocialUser;


  is_captcha!: boolean;
  isRecaptcha!: boolean;



  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService:AuthenticationService,
    private socialService: SocialAuthService,

  ) { 
    this.socialService.authState.subscribe((user) => {
      this.socialUser = user;
      console.log(this.socialUser,'Social Users')
      this.socailLogin();
    });
  }

  resolved(captchaResponse: string) {
    this.is_captcha = false;
    this.isRecaptcha = true;
    //console.log(`Resolved captcha with response ${captchaResponse}:`);
  }


  ngOnInit(): void {
    this.initLogin();

    var width = $('.g-recaptcha').parent().width();
    if (width < 302) {
      var scale = width / 302;
      // console.warn(scale)
      $('.g-recaptcha').css('transform', 'scale(' + scale + ')');
      $('.g-recaptcha').css('-webkit-transform', 'scale(' + scale + ')');
      $('.g-recaptcha').css('transform-origin', '0 0');
      $('.g-recaptcha').css('-webkit-transform-origin', '0 0');
    }
  }


  initLogin() {
    this.loginForm = this.formBuilder.group({
      email: [this.cookieEamil, [Validators.required, Validators.email]],
      password: [this.cookiePassword, [Validators.required]],
      isRemember:[]
    });
  }


  get f() { return this.loginForm.controls; }

  login(form: any) {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      const input_data:any = {
        "email": form.email,
        "password": form.password,
      }
      this.isBtnDisabled = true;
      this.userService.login(input_data).subscribe((res: any) => {
        if (!res.error) {
            this.toastr.success(res.message);
            localStorage.setItem('token_Key',JSON.stringify(res.body.token)) != null
            this.authService.setLogin(res.body)
            this.router.navigate(['/dashboard'])
        }
        else {
          this.toastr.error(res.message)
        }
        this.isBtnDisabled = false;
      }, error => {
        this.isBtnDisabled = false;
        this.toastr.error('Email not verified, please verify first!!')
      })

    }
  }

  signInWithFB(): void {
    this.socialService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  signInWithGmail(): void {
    this.socialService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  socailLogin() {
    if (this.socialUser && this.socialUser.email) {
      let data = {
        email: this.socialUser.email,
        username: this.socialUser.email,
        first_name: this.socialUser.firstName,
        last_name: this.socialUser.lastName,
        provider: this.socialUser.provider,
        photoUrl: this.socialUser.photoUrl,
      }
      this.userService.socialLoginMail(data).subscribe(res=>{
        if (!res.error) {
          this.toastr.success(res.msg);
          localStorage.setItem('token_Key',JSON.stringify(res.result.token)) != null
          this.authService.setLogin(res.result)
          this.router.navigate(['/dashboard'])
      }
      else {
        this.toastr.error(res.msg)
      }
        
      },error=>{
        this.toastr.error(error)
      })
    }
  }


}
