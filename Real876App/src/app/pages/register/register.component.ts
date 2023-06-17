import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CustomValidators, matchOtherValidator } from 'src/app/services/must-match.validator';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  activeTab: number = 1;
  // registerForm!: FormGroup;

  registerForm!: FormGroup;
  isReadOnly!: boolean;
  country_data: any;
  regemail: boolean = false;
  emailvalue: string = "";
  validemail: boolean = false;
  regemail1: boolean = false;
  emailvalue1: string = "";
  validemail1: boolean = false;
  submitted: boolean = false;
  mismatch: boolean = false;
  emailMismatch: boolean = false;
  isBtnDisabled: boolean = false;
  check_box: boolean = false;
  termIsChecked: boolean = false;
  show: boolean = false;
  show1: boolean = false;
  crStep: number = 1;
  currentDate!: string;

  isRegistered: boolean = false;
  checked: boolean = false;
  isSending: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private auth: AuthService,
    public translate: TranslateService
  ) {
    this.registerForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      user_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([
        Validators.required,
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        CustomValidators.patternValidator(/[@$#^!%*&!%*(?)_=+-]/, { hasSpecialCharacters: true }),
        Validators.minLength(8),
      ])],
      passwordConfirm: ['', [Validators.required, matchOtherValidator('password')]],
      chk1: ['']

    });

  }

  formatDate() {
    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }


  get f() { return this.registerForm.controls; }


  register() {
    this.submitted = true;
    for (let item of Object.keys(this.registerForm.controls)) {
      this.registerForm.controls[item].markAsDirty()
    }
    if (this.registerForm.value.password != this.registerForm.value.passwordConfirm) {
      this.mismatch = true;
      this.validemail = false;
      this.validemail1 = false;
      return;
    } else {
      this.mismatch = false;
      this.validemail1 = false;
      this.validemail = false;
    }
    if (this.registerForm.invalid) {
      return;
    } else {

      this.isBtnDisabled = true;
      let body = {
        "first_name": this.registerForm.value.first_name,
        "last_name": this.registerForm.value.last_name,
        "username": this.registerForm.value.user_name,
        "email": this.registerForm.value.email,
        "phone": this.registerForm.value.phone,
        "address": this.registerForm.value.address,
        "password": this.registerForm.value.password,
      }
      this.userService.register(body).subscribe((res: any) => {
        if (!res.error) {
          this.toastr.success('Verification link sent to your email address')
        }else{
          this.toastr.error(res.msg)
        }
        this.isBtnDisabled = false;

      },error=>{
        this.isBtnDisabled = false;
        this.toastr.error('oops something went wrong try again later!!')
      })
    }
  }

  getFormatedDtMn(mth: any) {
    if (mth < 10) {
      mth = '0' + mth;
    }
    return mth;
  }
  checkSpace(username: string) {
    if (username.match(/\s/g)) {
      return true;
    } else {
      return false;
    }
  }

  term(isChecked: boolean) {
    if (isChecked) {
      this.check_box = false;
      this.termIsChecked = true;
    } else {
      this.check_box = true;
      this.termIsChecked = false;
    }
  }

  password() {
    this.show = !this.show;
  }

  password1() {
    this.show1 = !this.show1;
  }

  onEnter() {
    this.mismatch = false;
  }

  email_verify($event: { target: { value: string; }; }) {

    this.emailMismatch = false;
    this.emailvalue = ($event.target.value);
    let email = this.validateEmail(this.emailvalue);
    // //console.log(this.emailvalue);
    if (email) {
      const input_data = {
        "email": this.emailvalue
      }

    } else {
      this.regemail = false;
      this.validemail = true;
    }

  }
  email_verify1($event: { target: { value: string; }; }) {
    this.emailMismatch = false;
    this.emailvalue = ($event.target.value);
    let email = this.validateEmail(this.emailvalue);
    // //console.log(this.emailvalue);
    if (email) {
      const input_data = {
        "email": this.emailvalue
      }

    } else {
      this.regemail1 = false;
      this.validemail1 = true;
    }

  }
  validateEmail(email: string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  goToLogin() {
    this.router.navigate(["/login"]);
  }

  omit_special_char(event: { charCode: any; }) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }


  nxtStep() {
    this.submitted = true;
    // if (this.registerForm.get('email').invalid || this.registerForm.get('first_name').invalid || this.registerForm.get('last_name').invalid || this.registerForm.get('chk1').invalid) {
    //   return
    // }
    if (this.crStep == 1) {
      this.crStep = 2;
    }
    else
      this.crStep = 1;
    this.submitted = false;
  }

  openTrmsCndt() {
    let url = "https://Real876-App.io/terms-and-conditions/"
    window.open(url, "_blank");
  }

  nextTab() {

    //this.activeTab = 2;
    if (this.registerForm.invalid) {
      return
    }
    else {
      this.register()
    }
  }

}
