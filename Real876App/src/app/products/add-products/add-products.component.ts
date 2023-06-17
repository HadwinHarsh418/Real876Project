import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/products/product.service';
import { AuthenticationService } from 'src/app/services/authentication.Service';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit {
  ProductForm!: FormGroup;
  @Input() getProductItem: any;
  selectedFiles: string='';
  loading: boolean = false;
  product_name: boolean = false
  product_description: boolean = false
  ingredients: boolean = false
  manufacturer: boolean = false
  manufactured_date: boolean = false
  expiry_date: boolean = false
  recyclable: boolean = false
  authorized_distributers: boolean = false
  interesting_recipes: boolean = false
  about_the_company: boolean = false
  contact_us: boolean = false
  nutri_score: boolean = false
  health_warning: boolean = false
  product_warning: boolean = false
  user_id: any;

  constructor(private formBuilder: FormBuilder, public toaster: ToastrService, private modalService: NgbModal, private ActiveModal: NgbActiveModal,
    private apiService: ProductService,private autheticationService:AuthenticationService) {
      this.autheticationService.currentUser.subscribe(res=>{
        this.user_id = res.user_id
      })
  }

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.ProductForm = this.formBuilder.group({
      product_name: [{ value: this.getProductItem?.product_name || '', disabled: this.product_name }, this.customValidation(this.getProductItem?.product_name_check, 'product_name'),],
      product_description: [{ value: this.getProductItem?.product_description || '', disabled: this.product_description }, this.customValidation(this.getProductItem?.product_description_check, 'product_description'),],
      ingredients: [{ value: this.getProductItem?.ingredients || '', disabled: this.ingredients }, this.customValidation(this.getProductItem?.ingredients_check, 'ingredients'),],
      manufacturer: [{ value: this.getProductItem?.manufacturer || '', disabled: this.manufacturer }, this.customValidation(this.getProductItem?.manufacturer_check, 'manufacturer'),],
      manufactured_date: [{ value: this.getProductItem?.manufactured_date || '', disabled: this.manufactured_date }, this.customValidation(this.getProductItem?.manufactured_date_check, 'manufactured_date'),],
      expiry_date: [{ value: this.getProductItem?.expiry_date || '', disabled: this.expiry_date }, this.customValidation(this.getProductItem?.expiry_date_check, 'expiry_date'),],
      recyclable: [{ value: this.getProductItem?.recyclable || '', disabled: this.recyclable }, this.customValidation(this.getProductItem?.recyclable_check, 'recyclable'),],
      recyclable_check: [this.getProductItem?.recyclable_check || ''],
      authorized_distributers: [{ value: this.getProductItem?.authorized_distributers || '', disabled: this.authorized_distributers }, this.customValidation(this.getProductItem?.authorized_distributers_check, 'authorized_distributers'),],
      authorized_distributers_check: [this.getProductItem?.authorized_distributers_check || ''],
      interesting_recipes: [{ value: this.getProductItem?.interesting_recipes || '', disabled: this.interesting_recipes }, this.customValidation(this.getProductItem?.interesting_recipes_check, 'interesting_recipes'),],
      about_the_company: [{ value: this.getProductItem?.about_the_company || '', disabled: this.about_the_company }, this.customValidation(this.getProductItem?.about_the_company_check, 'about_the_company'),],
      contact_us: [{ value: this.getProductItem?.contact_us || '', disabled: this.contact_us }, this.customValidation(this.getProductItem?.contact_us_check, 'contact_us'),],
      nutri_score: [{ value: this.getProductItem?.nutri_score || '', disabled: this.nutri_score }, this.customValidation(this.getProductItem?.nutri_score_check, 'nutri_score'),],
      health_warning: [{ value: this.getProductItem?.health_warning || '', disabled: this.health_warning }, this.customValidation(this.getProductItem?.health_warning_check, 'health_warning'),],
      product_warning: [{ value: this.getProductItem?.product_warning || '', disabled: this.product_warning }, this.customValidation(this.getProductItem?.product_warning_check, 'product_warning'),],
      product_name_check: [this.getProductItem?.product_name_check || ''],
      product_description_check: [this.getProductItem?.product_description_check || ''],
      manufacturer_check: [this.getProductItem?.manufacturer_check || ''],
      manufactured_date_check: [this.getProductItem?.manufactured_date_check || ''],
      expiry_date_check: [this.getProductItem?.expiry_date_check || ''],
      about_the_company_check: [this.getProductItem?.about_the_company_check || ''],
      contact_us_check: [this.getProductItem?.contact_us_check || ''],
      interesting_recipes_check: [this.getProductItem?.interesting_recipes_check || ''],
      nutri_score_check: [this.getProductItem?.nutri_score_check || ''],
      health_warning_check: [this.getProductItem?.health_warning_check || ''],
      product_warning_check: [this.getProductItem?.product_warning_check || ''],
      ingredients_check: [this.getProductItem?.ingredients_check || '',],


    })
  }
  customValidation(value: any, control: any) {
    let data: any
    if (value == 'Yes' || !value) {
      data = Validators.required
    } else {
      data = ''
    }
    return data
  }

  get getForm() {
    return this.ProductForm.controls
  }

  onSubmit() {
    for (let item of Object.keys(this.ProductForm.controls)) {
      this.ProductForm.controls[item].markAsDirty()
    }
    if (this.ProductForm.invalid) {
      this.toaster.error('Please fill all required fields')
      return;
    }
    this.loading = true
    this.ProductForm.value.user_id = this.user_id;
    if (this.getProductItem) {
      this.ProductForm.value.product_id = this.getProductItem.product_id;
      this.apiService.updateProduct(this.ProductForm.value).subscribe((res: any) => {
        if (!res.error) {
          this.toaster.success(res.msg)
          this.ActiveModal.dismiss(res);
        } else {
          this.toaster.error(res.msg)
        }
        this.loading = false

      }, () => {
        this.loading = false
      })
    } else {
      this.apiService.addProduct(this.ProductForm.value).subscribe((res: any) => {
        if (!res.error) {
          this.toaster.success(res.msg);
          this.ActiveModal.dismiss(res);
        } else {
          this.toaster.error(res.msg)
        }
        this.loading = false
      }, () => {
        this.loading = false
      })
    }

  }
  validators(value: any, control: any) {
    if (value == 'Yes' || value == '') {
      switch (control) {
        case 'product_name': {
          this.ProductForm.controls['product_name'].setValidators([Validators.required])
          this.ProductForm.get('product_name')?.updateValueAndValidity();
          this.ProductForm.get('product_name')?.enable();
      this.product_name = false;
        }
          break;
          case 'product_description': {
            this.ProductForm.controls['product_description'].setValidators([Validators.required])
            this.ProductForm.get('product_description')?.updateValueAndValidity();
            this.ProductForm.get('product_description')?.enable();
        this.product_description = false;
          }
            break;
        case 'ingredients': {
          this.ProductForm.controls['ingredients'].setValidators([Validators.required])
          this.ProductForm.get('ingredients')?.updateValueAndValidity();
          this.ProductForm.get('ingredients')?.enable();
      this.ingredients = false;
        }
          break;
        case 'manufacturer': {
          this.ProductForm.controls['manufacturer'].setValidators([Validators.required])
          this.ProductForm.get('manufacturer')?.updateValueAndValidity();
          this.ProductForm.get('manufacturer')?.enable();
      this.manufacturer = false;
        }
          break;
        case 'manufactured_date': {
          this.ProductForm.controls['manufactured_date'].setValidators([Validators.required])
          this.ProductForm.get('manufactured_date')?.updateValueAndValidity();
          this.ProductForm.get('manufactured_date')?.enable();
      this.manufactured_date = false;
        }
          break;
        case 'expiry_date': {
          this.ProductForm.controls['expiry_date'].setValidators([Validators.required])
          this.ProductForm.get('expiry_date')?.updateValueAndValidity();
          this.ProductForm.get('expiry_date')?.enable();
      this.expiry_date = false;
        }
          break;
        case 'recyclable': {
          this.ProductForm.controls['recyclable'].setValidators([Validators.required])
          this.ProductForm.get('recyclable')?.updateValueAndValidity();
          this.ProductForm.get('recyclable')?.enable();
      this.recyclable = false;
        }
          break;
        case 'authorized_distributers': {
          this.ProductForm.controls['authorized_distributers'].setValidators([Validators.required])
          this.ProductForm.get('authorized_distributers')?.updateValueAndValidity();
          this.ProductForm.get('authorized_distributers')?.enable();
      this.authorized_distributers = false;
        }
          break;
        case 'interesting_recipes': {
          this.ProductForm.controls['interesting_recipes'].setValidators([Validators.required])
          this.ProductForm.get('interesting_recipes')?.updateValueAndValidity();
          this.ProductForm.get('interesting_recipes')?.enable();
      this.interesting_recipes = false;
        }
          break;
        case 'nutri_score': {
          this.ProductForm.controls['nutri_score'].setValidators([Validators.required])
          this.ProductForm.get('nutri_score')?.updateValueAndValidity();
          this.ProductForm.get('nutri_score')?.enable();
      this.nutri_score = false;
        }
          break;
        case 'health_warning': {
          this.ProductForm.controls['health_warning'].setValidators([Validators.required])
          this.ProductForm.get('health_warning')?.updateValueAndValidity();
          this.ProductForm.get('health_warning')?.enable();
      this.health_warning = false;
        }
          break;
        case 'product_warning': {
          this.ProductForm.controls['product_warning'].setValidators([Validators.required])
          this.ProductForm.get('product_warning')?.updateValueAndValidity();
          this.ProductForm.get('product_warning')?.enable();
      this.product_warning = false;
        }
          break;
        case 'about_the_company': {
          this.ProductForm.controls['about_the_company'].setValidators([Validators.required])
          this.ProductForm.get('about_the_company')?.updateValueAndValidity();
          this.ProductForm.get('about_the_company')?.enable();
      this.about_the_company = false;
        }
          break;
        case 'contact_us': {
          this.ProductForm.controls['contact_us'].setValidators([Validators.required])
          this.ProductForm.get('contact_us')?.updateValueAndValidity();
          this.ProductForm.get('contact_us')?.enable();
      this.contact_us = false;
        }
          break;
      }

    } else {
      switch (control) {
        case 'product_name': {
          this.ProductForm.controls['product_name'].clearValidators();
          this.ProductForm.get('product_name')?.updateValueAndValidity();
          this.ProductForm.get('product_name')?.disable();
          this.ProductForm.controls['product_name'].setValue('');
          this.product_name = true;
        }
          break;
        case 'product_description': {
          this.ProductForm.controls['product_description'].clearValidators();
          this.ProductForm.get('product_description')?.updateValueAndValidity();
          this.ProductForm.get('product_description')?.disable();
          this.ProductForm.controls['product_description'].setValue('');
          this.product_description = true;
        }
          break;
        case 'ingredients': {
          this.ProductForm.controls['ingredients'].clearValidators();
          this.ProductForm.get('ingredients')?.updateValueAndValidity();
          this.ProductForm.get('ingredients')?.disable();
          this.ProductForm.controls['ingredients'].setValue('');
          this.ingredients = true;
        }
          break;
        case 'manufacturer': {
          this.ProductForm.controls['manufacturer'].clearValidators();
          this.ProductForm.get('manufacturer')?.updateValueAndValidity();
          this.ProductForm.get('manufacturer')?.disable();
          this.ProductForm.controls['manufacturer'].setValue('');
          this.manufacturer = true;
        }
          break;
        case 'manufactured_date': {
          this.ProductForm.controls['manufactured_date'].clearValidators();
          this.ProductForm.get('manufactured_date')?.updateValueAndValidity();
          this.ProductForm.get('manufactured_date')?.disable();
          this.ProductForm.controls['manufactured_date'].setValue('');
          this.manufactured_date = true;
        }
          break;
        case 'expiry_date': {
          this.ProductForm.controls['expiry_date'].clearValidators();
          this.ProductForm.get('expiry_date')?.updateValueAndValidity();
          this.ProductForm.get('expiry_date')?.disable();
          this.ProductForm.controls['expiry_date'].setValue('');
          this.expiry_date = true;
        }
          break;
        case 'recyclable': {
          this.ProductForm.controls['recyclable'].clearValidators();
          this.ProductForm.get('recyclable')?.updateValueAndValidity();
          this.ProductForm.get('recyclable')?.disable();
          this.ProductForm.controls['recyclable'].setValue('');
          this.recyclable = true;
        }
          break;
        case 'authorized_distributers': {
          this.ProductForm.controls['authorized_distributers'].clearValidators();
          this.ProductForm.get('authorized_distributers')?.updateValueAndValidity();
          this.ProductForm.get('authorized_distributers')?.disable();
          this.ProductForm.controls['authorized_distributers'].setValue('');
          this.authorized_distributers = true;
        }
          break;
        case 'interesting_recipes': {
          this.ProductForm.controls['interesting_recipes'].clearValidators();
          this.ProductForm.get('interesting_recipes')?.updateValueAndValidity();
          this.ProductForm.get('interesting_recipes')?.disable();
          this.ProductForm.controls['interesting_recipes'].setValue('');
          this.interesting_recipes = true;
        }
          break;
        case 'nutri_score': {
          this.ProductForm.controls['nutri_score'].clearValidators();
          this.ProductForm.get('nutri_score')?.updateValueAndValidity();
          this.ProductForm.get('nutri_score')?.disable();
          this.ProductForm.controls['nutri_score'].setValue('');
          this.nutri_score = true;
        }
          break;
        case 'health_warning': {
          this.ProductForm.controls['health_warning'].clearValidators();
          this.ProductForm.get('health_warning')?.updateValueAndValidity();
          this.ProductForm.get('health_warning')?.disable();
          this.ProductForm.controls['health_warning'].setValue('');
          this.health_warning = true;
        }
          break;
        case 'product_warning': {
          this.ProductForm.controls['product_warning'].clearValidators();
          this.ProductForm.get('product_warning')?.updateValueAndValidity();
          this.ProductForm.get('product_warning')?.disable();
          this.ProductForm.controls['product_warning'].setValue('');
          this.product_warning = true;
        }
          break;
        case 'about_the_company': {
          this.ProductForm.controls['about_the_company'].clearValidators();
          this.ProductForm.get('about_the_company')?.updateValueAndValidity();
          this.ProductForm.get('about_the_company')?.disable();
          this.ProductForm.controls['about_the_company'].setValue('');
          this.about_the_company = true;
        }
          break;
        case 'contact_us': {
          this.ProductForm.controls['contact_us'].clearValidators();
          this.ProductForm.get('contact_us')?.updateValueAndValidity();
          this.ProductForm.get('contact_us')?.disable();
          this.ProductForm.controls['contact_us'].setValue('');
          this.contact_us = true;
        }
          break;
      }
    }
  }
  cancel() {
    this.ProductForm.reset()
    this.getProductItem = ''
    this.modalService.dismissAll();
  }


}