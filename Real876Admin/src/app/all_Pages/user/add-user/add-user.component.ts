import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'app/services/product.service';
import { UserService } from 'app/services/user.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  UserForm!:FormGroup;
  @Input() getUserData:any;
  constructor(private formBuilder:FormBuilder,public toaster:ToastrManager,private modalService:NgbModal,private ActiveModal:NgbActiveModal,
    private apiService:UserService, private router:Router) {
    this.initForm()
   }

  ngOnInit(): void {
    
    if(this.getUserData){
      this.formPatchValue()
    }
  }

  initForm(){
    this.UserForm = this.formBuilder.group({
      user_id:[''],
      first_name: ['',Validators.required],
      last_name: ['',Validators.required],
      username: ['',Validators.required],
      email:['',Validators.required],
      phone: ['',Validators.required],
      address:['',Validators.required],
    })
  }
  formPatchValue(){
    this.UserForm.patchValue({
      "user_id":this.getUserData.user_id,
      "first_name":this.getUserData.first_name,
      "last_name":this.getUserData.last_name,
      "username":this.getUserData.username,
      "email":this.getUserData.email,
      "phone":this.getUserData.phone,
      "address":this.getUserData.address,
    })

  }

  get getForm(){
    return this.UserForm.controls
  }

  onSubmit(){
    for (let item of Object.keys(this.UserForm.controls)) {
      this.UserForm.controls[item].markAsDirty()
    }
    if(this.UserForm.invalid){
      this.toaster.errorToastr('Please fill all required fields')
      return;
    }
    if(this.getUserData){
      this.UserForm.value.product_id = this.getUserData.product_id
      this.apiService.updateUser(this.UserForm.value).subscribe((res:any)=>{
        if(!res.error){
          this.toaster.successToastr(res.msg)
          this.ActiveModal.dismiss(res);
        }else{
          this.toaster.errorToastr(res.msg)
        }
        
      })
    }else{
      this.apiService.addUser(this.UserForm.value).subscribe((res:any)=>{
        if(!res.error){
          this.toaster.successToastr(res.msg);
          this.ActiveModal.dismiss(res);
        }else{
          this.toaster.errorToastr(res.msg)
        }
        
      })
    }

  }
  cancel(){
    this.UserForm.reset()
    this.getUserData={}
    this.modalService.dismissAll();
  }

}
