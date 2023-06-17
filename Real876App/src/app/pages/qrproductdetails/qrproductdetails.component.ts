import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/products/product.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';

declare var google:any
@Component({
  selector: 'app-qrproductdetails',
  templateUrl: './qrproductdetails.component.html',
  styleUrls: ['./qrproductdetails.component.scss']
})
export class QrproductdetailsComponent implements OnInit {
  productsDetails: any;
  ProductForm!: FormGroup;
  productId: any;
  checkingCode = true;
  status=0;
  deviceInfo: any;
  ipAddress: any;
  


  constructor(private _activatedRoute:ActivatedRoute,private deviceService: DeviceDetectorService,private productService:ProductService,private formBuilder: FormBuilder,private http:HttpClient) {
    this.epicFunction()
    this.http.get('https://jsonip.com/').subscribe(res=>{
      console.log(res);
      
      this.ipAddress = res
    })
    this._activatedRoute.params.subscribe((res:any)=>{
      this.productId = res.id
  })
  }

  epicFunction() {
    console.log('hello `Home` component');
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
  }

  ngOnInit(): void {
    this.initForm()
    this.productService.getProductsById(this.productId).subscribe((res:any)=>{
      if(!res.error){
        this.productsDetails = res.body[0]
        this.patchForm()
        this.checkingCode = false;
        this.status =1;
      }else{
        this.checkingCode = false;
          this.status =2;
      }
  },error=>{
    this.checkingCode = false;
        this.status =2;
  })
  }

  patchForm(){
    this.ProductForm.patchValue({
      product_name: this.productsDetails?.product_name,
      product_description: this.productsDetails?.product_description,
      ingredients: this.productsDetails?.ingredients,
      manufacturer: this.productsDetails?.manufacturer,
      manufactured_date: this.productsDetails?.manufactured_date,
      expiry_date: this.productsDetails?.expiry_date,
      recyclable: this.productsDetails?.recyclable,
      recyclable_check: this.productsDetails?.recyclable_check,
      authorized_distributers: this.productsDetails?.authorized_distributers,
      authorized_distributers_check: this.productsDetails?.authorized_distributers_check,
      interesting_recipes: this.productsDetails?.interesting_recipes,
      about_the_company: this.productsDetails?.about_the_company,
      contact_us: this.productsDetails?.contact_us,
      nutri_score: this.productsDetails?.nutri_score,
      health_warning: this.productsDetails?.health_warning,
      product_warning: this.productsDetails?.product_warning,
      product_name_check: this.productsDetails?.product_name_check,
      product_description_check: this.productsDetails?.product_description_check,
      manufacturer_check: this.productsDetails?.manufacturer_check,
      manufactured_date_check: this.productsDetails?.manufactured_date_check,
      expiry_date_check: this.productsDetails?.expiry_date_check,
      about_the_company_check: this.productsDetails?.about_the_company_check,
      contact_us_check: this.productsDetails?.contact_us_check,
      interesting_recipes_check: this.productsDetails?.interesting_recipes_check,
      nutri_score_check: this.productsDetails?.nutri_score_check,
      health_warning_check: this.productsDetails?.health_warning_check,
      product_warning_check: this.productsDetails?.product_warning_check,
      ingredients_check: this.productsDetails?.ingredients_check,
    })
  }

  initForm() {
    this.ProductForm = this.formBuilder.group({
      product_name: [''],
      product_description: [''],
      ingredients: [''],
      manufacturer: [''],
      manufactured_date: [''],
      expiry_date: [''],
      recyclable: [''],
      recyclable_check: [''],
      authorized_distributers: [''],
      authorized_distributers_check: [''],
      interesting_recipes: [''],
      about_the_company: [''],
      contact_us: [''],
      nutri_score: [''],
      health_warning: [''],
      product_warning: [''],
      product_name_check: [''],
      product_description_check: [''],
      manufacturer_check: [''],
      manufactured_date_check: [''],
      expiry_date_check: [''],
      about_the_company_check: [''],
      contact_us_check: [''],
      interesting_recipes_check: [''],
      nutri_score_check: [''],
      health_warning_check: [''],
      product_warning_check: [''],
      ingredients_check: [''],


    })
  }
}
