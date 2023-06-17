import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/services/user.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AddUserComponent } from './add-user/add-user.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  rows: any[] = []
  oneProduct: any;
  constructor(private modalService: NgbModal, private apiService: UserService,private toaster:ToastrManager) {
    this.getAllUsers()
  }

  ngOnInit(): void {
  }

  getAllUsers() {
    this.apiService.getAllUsers().subscribe((res: any) => {
      if (!res.error) {
        this.rows = res.body
      }

    })
  }
  editProduct(data: any) {
    this.oneProduct = data
    const modalRef = this.modalService.open(AddUserComponent,
      {
        backdrop: true, centered: true, size: 'xl',
        // modalDialogClass:'dark-bg select-city-modal'});
      });
    modalRef.componentInstance.getUserData = this.oneProduct;
    modalRef.result.then(res=>{
      this.getAllUsers();
      console.log("Success",res);
      
    },dismiss=>{
      console.log("Cross Button",dismiss)
      this.getAllUsers();
    })
  }
  open() {
    const modalRef = this.modalService.open(AddUserComponent,
      {
        backdrop: true, centered: true, size: 'xl',
        // modalDialogClass:'dark-bg select-city-modal'});
      });
    modalRef.componentInstance.getUserData = '';
    modalRef.componentInstance.modalRef  = modalRef;
    modalRef.result.then(res=>{
      console.log(res);
      
      console.log("CloseButton", res)
    },dismiss=>{
      console.log("Cross Button",dismiss)
    })
  }
  deleteProduct(row: any) {
    this.apiService.deleteUser(row.user_id).subscribe((res:any)=>{
      if(!res.error){
        this.toaster.successToastr(res.msg)
        this.getAllUsers()
      }else{
        this.toaster.errorToastr('Something went wrong please try again')
      }
      
    })
  }
  userInactive(row: any){
    let body={
      user_id:row.user_id
    }
    this.apiService.inactiveUser(body).subscribe((res:any)=>{
      if(!res.error){
        this.toaster.successToastr(res.msg)
        this.getAllUsers()
      }else{
        this.toaster.errorToastr('Something went wrong please try again')
      }
      
    })
  }
  getRowClass = (row) => {    
    return {
      'row-color1': row.is_login_access == 0,
    };
   }

}
