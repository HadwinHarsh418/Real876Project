import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CustomValidators, matchOtherValidator } from 'src/app/services/must-match.validator';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm!: FormGroup;
  verifyOtpForm!: FormGroup;
  user_id: any;
  isBtnDisabled: boolean = false;
  submitted: boolean = false;
  emailvalue: string = "";
  red: boolean = false;
  green: boolean = false;
  is_captcha: boolean = false;
  isRecaptcha: boolean = false;
  showModal!: boolean;
  VerifySubmitted!: boolean;
  verifyBtnDisabled!: boolean;
  encodedemail: string = '';
  pickedemail: string = '';
  codeSent!: boolean;
  timeLeft: number = 0;
  timeInter: any;
  selectedValue: string = 'en';
  token: any;
  @ViewChild('resetPswdModal') resetPswdModal!: ElementRef<any>;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private modalService: NgbModal,
    public translate: TranslateService
  ) { 
    this.initForm();
  }

  ngOnInit(): void {
  }

  initForm() {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.verifyOtpForm = this.formBuilder.group({
      code: ['', [Validators.required]],
      password: ['', Validators.compose([
        Validators.required,
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        CustomValidators.patternValidator(/[@$#^!%*&!%*(?)_=+-]/, { hasSpecialCharacters: true }),
        Validators.minLength(8),
      ])],
      passwordConfirm: ['', [Validators.required, matchOtherValidator('password')]],
    });

  }


  ngAfterViewInit(): void {

  }



  get f() { return this.forgotForm.controls; }
  get vf() { return this.verifyOtpForm.controls; }

  onPassEnter($event:any) {

    this.emailvalue = ($event.target.value);
    let email = this.validateEmail(this.emailvalue);
    if (email) {
      this.green = true;
    } else {
      this.green = false;
    }
  }
  resolved(captchaResponse: string) {
    this.is_captcha = false;
    this.isRecaptcha = true;
    //console.log(`Resolved captcha with response ${captchaResponse}:`);
  }
  validateEmail(email: string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  forgotPassword(form = null, nocheck = false, modal?: any) {
    this.submitted = true;
    if (this.forgotForm.invalid) {
      return;
    } else {
      if (!this.isRecaptcha && location.href.indexOf('localhost:4200') == -1) {
        this.is_captcha = true;
        this.toastr.error('Captcha is required');
        return;
      }
      const input_data = {
        "email": this.forgotForm.value.email
      }
      let enc_data = this.auth.encrypt(JSON.stringify(input_data))
      this.isBtnDisabled = true;
    }
  }

  goToLogin() {
    this.router.navigate(["/login"]);
  }

  resetTiming() {
    if (this.timeInter) {
      clearInterval(this.timeInter);
    }
    this.codeSent = true;
    this.timeLeft = 299;
    this.timeInter = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.codeSent = false;
        // this.auth.tempToken = '';
        clearInterval(this.timeInter);
        this.isBtnDisabled = false;
      }
    }, 1000)
  }

  openVeirficationModal() {
    this.verifyOtpForm.reset();
    this.encodedemail = `${this.pickedemail.substr(0, 3)}
                         ***${this.pickedemail.substr(
      this.pickedemail.indexOf('@')
    )}`
    this.VerifySubmitted = false;
    this.verifyBtnDisabled = false;
    // this.showModal = true;
  }

  close() {
    this.showModal = false;
  }

  verifyOtpSubmit(modal: NgbModalRef) {
    this.VerifySubmitted = true;
    if (this.verifyOtpForm.invalid) {
      return;
    } else {
      this.verifyBtnDisabled = true;
      const input_data = {
        "forgotten_password_code": this.verifyOtpForm.value.code,
        "newPassword": this.verifyOtpForm.value.password,
        "confPassword": this.verifyOtpForm.value.passwordConfirm
      }
    }
  }

  openResetPswdModal() {
    this.initForm();
    this.modalOpenOSE(this.resetPswdModal)
  }



  modalOpenOSE(modalOSE: ElementRef<any>, size = 'lg') {
    this.modalService.open(modalOSE,
      {
        backdrop: false,
        size: size,
        centered: true,
      }
    );
  }

  closed(modal: NgbModalRef) {
    modal.dismiss();
    this.isBtnDisabled = false;
    this.submitted = false;
  }

}
