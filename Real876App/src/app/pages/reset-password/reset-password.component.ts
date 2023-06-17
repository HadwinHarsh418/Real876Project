import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators, matchOtherValidator } from 'src/app/services/must-match.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  verifyOtpForm!: FormGroup;
  VerifySubmitted!: boolean;
  verifyBtnDisabled!: boolean;
  isBtnDisabled!: boolean;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    //public translate: TranslateService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
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

  get vf() { return this.verifyOtpForm.controls; }

  verifyOtpSubmit(form:any) {
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

}
