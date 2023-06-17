import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { Users } from 'src/app/models/users';
import { ToastrService } from 'ngx-toastr';
import { copyTextAreaToClipBoard } from 'src/app/_helpers/utils';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/authentication.Service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user!: Users;
  @ViewChild('addNotificaion') addNotificaion!: ElementRef<any>;


  constructor(
    private authservice: AuthenticationService,
    private toastr: ToastrService,
    public translate: TranslateService,
    private modalService: NgbModal,

  ) { 
     this.authservice.currentUser.subscribe((res:any)=>{
      this.user = res
    });
  }

  ngOnInit(): void {
  }

  logout() {
    this.authservice.logout();
  }
  toggle() {
    $("body").removeClass("menu-tg");

  }

  toggleClass() {
    $('html').toggleClass('light-layout dark-layout')

  }

  copyInputMessage() {
    if (this.user.referral_code) {
      copyTextAreaToClipBoard(`https://app.Real876-App.io/register/${this.user.referral_code}`);
      this.translate.get('rfrlLnk').subscribe(res => {
        this.toastr.success(res);
      })
      // this.toastr.successToastr('Referral link copied');
    }
  }

  openNotificaitonModal() {
    // if (row && row.id) {
    //   this.titleTxt = 'Update'
    //   this.rowObj = row;
    // }
    //this.securityCode = '';
    //this.title = '';
    //this.description = '';
    //this.getAllUsers();
    this.modalOpenOSE(this.addNotificaion);
  }

  modalOpenOSE(modalOSE:any) {
    this.modalService.open(modalOSE,
      {
        backdrop: false,
        centered: true,
        size: 'lg'
      }
    );
  }

  closed(modal: NgbModalRef) {
    //this.titleTxt = 'Add'
   // this.rowObj = null;
    modal.dismiss();
  }
}
