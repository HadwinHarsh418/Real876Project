import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-confirmation-page',
  templateUrl: './confirmation-page.component.html',
  styleUrls: ['./confirmation-page.component.scss']
})
export class ConfirmationPageComponent implements OnInit {
  checkingCode = true;
  status=0;

  constructor(private route: ActivatedRoute,private api_service:UserService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.checkingCode = true;
      this.api_service.verifyEmail(params['id']).subscribe((res:any)=>{
        if(res.error){
          this.toastr.error(res.msg)
          this.checkingCode = false;
          this.status =2;
        }else{
          this.toastr.success('Account has been verified successfully!')
          this.checkingCode = false;
          this.status =1;
        }
      }, error => {
        this.toastr.error('Something went wrong please, try check your verification link.')
        this.checkingCode = false;
        this.status =2;
      })
    });
  }

}
