import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ProductService } from 'src/app/products/product.service';
import { AuthenticationService } from 'src/app/services/authentication.Service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-ecommerce',
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[ProductService]
})
export class EcommerceComponent implements OnInit {
  @ViewChild('gainedChartRef') gainedChartRef: any;
  
 
  // Public
  public status: any = {Total_Products:  0, Total_Register_Users:  0};
  public data: any = {total_Survey:  0, total_calls:  0, total_customers: 0};
  public currentUser: any;
  public loadingStats!: boolean;


  storeCount: any;
  totalDetails: any;
  rows: any[]=[];

  /**
   * Constructor
   * @param {AuthenticationService} _authenticationService
   * @param {DashboardService} _dashboardService
   */
  constructor(
    private _dashboardService: DashboardService,
    private _authenticationService:AuthenticationService,
    private _productService:ProductService
  ) {
    this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));
    this.getDashboard()
    this.getProducts()
  }

  getDashboard(){
    this._dashboardService.getDashboardData().subscribe((res:any)=>{
      this.status = res.body[0]  
    })
  }
  getProducts() {
    this._productService.getProducts().subscribe((res: any) => {
      if (!res.error) {
        this.rows=res.body
      }

    })
  }
  ngOnInit(): void {
    this.loadingStats = true;
  }
}
