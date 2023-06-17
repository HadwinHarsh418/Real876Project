import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { DashboardService } from 'app/main/dashboard/dashboard.service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';

@Component({
  selector: 'app-ecommerce',
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceComponent implements OnInit {
  @ViewChild('gainedChartRef') gainedChartRef: any;
  
 
  // Public
  public status: any = {Total_Products:  0, Total_Register_Users:  0};
  public data: any = {total_Survey:  0, total_calls:  0, total_customers: 0};
  public currentUser: User;
  public isAdmin: boolean;
  public isClient: boolean;
  public loadingStats: boolean;

  storeCount: any;
  totalDetails: any;

  /**
   * Constructor
   * @param {AuthenticationService} _authenticationService
   * @param {DashboardService} _dashboardService
   */
  constructor(
    private _authenticationService: AuthenticationService,
    private _dashboardService: DashboardService,
    private _encryptionService: EncryptionService
  ) {
    this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));
    this.isAdmin = this._authenticationService.isAdmin;
    this.isClient = this._authenticationService.isClient;;
    this.getDashboard()
  }

  getDashboard(){
    this._dashboardService.getDashboardData().subscribe((res:any)=>{
      this.status = res.body[0]  
    })
  }
  ngOnInit(): void {
    this.loadingStats = true;
  }
}
