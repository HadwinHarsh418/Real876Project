import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'app/services/common.service';
import { UserService } from 'app/services/user.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile-details',
  templateUrl: './user-profile-details.component.html',
  styleUrls: ['./user-profile-details.component.scss']
})
export class UserProfileDetailsComponent implements OnInit {
  UserForm!: FormGroup;
  getUserData: any;
  countryList: any[] = [];
  selectedDataValue: any;
  userQuestionUpdate = new Subject<string>();
  tempContry: any[];
  submitted:boolean = false;
  loading:boolean = false;

  constructor(private formBuilder: FormBuilder, public toaster: ToastrManager,
    private apiService: UserService, private router: Router, private ActivatedRoute: ActivatedRoute, private commonService: CommonService) {
    this.ActivatedRoute.params.subscribe((res: any) => {
      if (res.id) {
        this.getUserById(res.id)
      }
    })
    this.userQuestionUpdate.pipe(
      debounceTime(200),
      distinctUntilChanged())
      .subscribe((value: any) => {
        if (value) {
          this.countryList = this.countryList.filter((item: any) => {
            // iterate through each row's column data
            for (let i = 0; i < this.countryList.length; i++) {
              // check for a match
              if (item.countryCode == value) {
                return item;
              }
            }
          })
        } else {
          this.countryList = this.tempContry
        }
      });
    this.getCountryList()
    this.initForm()
  }

  ngOnInit(): void {
  }

  getCountryList() {
    this.commonService.getAllCountry().subscribe(res => {
      this.countryList = res.body;
      this.tempContry = res.body;
    })
  }

  getUserById(id: any) {
    this.apiService.getUserById(id).subscribe((res: any) => {
      this.getUserData = res.body[0];
      this.formPatchValue()
    })
  }

  initForm() {
    this.UserForm = this.formBuilder.group({
      user_id: [''],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      country_code: ['']
    })
  }
  formPatchValue() {
    this.UserForm.patchValue({
      "user_id": this.getUserData.user_id,
      "first_name": this.getUserData.first_name,
      "last_name": this.getUserData.last_name,
      "username": this.getUserData.username,
      "email": this.getUserData.email,
      "phone": this.getUserData.phone,
      "address": this.getUserData.address,
    })
    this.selectedDataValue = this.getUserData.country_code

  }

  get getForm() {
    return this.UserForm.controls
  }

  onSubmit() {
    this.submitted = true;
    for (let item of Object.keys(this.UserForm.controls)) {
      this.UserForm.controls[item].markAsDirty()
    }
    if (this.UserForm.invalid) {
      this.toaster.errorToastr('Please fill all required fields')
      return;
    }
    if (!this.selectedDataValue) {
      this.toaster.errorToastr('Please fill all required fields')
      return;
    }
    this.loading = true
    this.UserForm.controls['country_code'].setValue(this.selectedDataValue)
    if (this.getUserData) {
      this.UserForm.value.product_id = this.getUserData.product_id
      this.apiService.updateUser(this.UserForm.value).subscribe((res: any) => {
        if (!res.error) {
          this.toaster.successToastr(res.msg);
          // this.router.navigate(['/users'])
        } else {
          this.toaster.errorToastr(res.msg)
        }
        this.loading=false;
      },error=>{
        this.loading=false;

      })
    } else {
      this.apiService.addUser(this.UserForm.value).subscribe((res: any) => {
        if (!res.error) {
          this.toaster.successToastr(res.msg);
          this.router.navigate(['/users'])
        } else {
          this.toaster.errorToastr(res.msg)
        }
        this.loading=false;
      },error=>{
        this.loading=false;

      })
    }

  }
  cancel() {
    this.UserForm.reset()
    this.getUserData = {}
    this.router.navigate(['/users'])
  }
  mapCountry_selected(data) {
    return this.selectedDataValue = data.countryCode;
  }
  searchCountry(event) {
    const val = event.target.value;
    if (val) {
      this.countryList = this.tempContry.filter(item => item.countryCode.indexOf(val) > -1 || item.iso2.indexOf(val) > -1 || item.defaultName.indexOf(val) > -1)
    } else {
      this.countryList = this.tempContry
    }
  }

}
