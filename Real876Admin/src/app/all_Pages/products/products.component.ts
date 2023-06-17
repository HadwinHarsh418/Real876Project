import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'app/services/product.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AddProductsComponent } from './add-products/add-products.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild('content', { static: false }) content: any;
  rows: any[] = []
  oneProduct: any;
  qrcode: any;
  private keyUpFxn = new Subject<any>();
  selected: any[] = []
  selectIdCheck:boolean = true;
  public selectionType: SelectionType = SelectionType.checkbox;



  constructor(private modalService: NgbModal, private apiService: ProductService,private toaster:ToastrManager) {
    this.getProducts()
    this.keyUpFxn.pipe(
      debounceTime(1000)
    ).subscribe(searchTextValue => {
      this.getProducts(searchTextValue)
    });
  }

  ngOnInit(): void {
  }

  getProducts(val?:any) {
    let body
    if(val !='delete'){
      body = {
        searchStr:val
      }
    }
    this.apiService.getProducts(body).subscribe((res: any) => {
      if (!res.error) {
        res.body = res.body.map((i:any)=>{i.isSelected = false; i.isAllSelected = false; return i})
        if(val =='delete'){
          res.body = res.body.filter((i:any)=>{
            this.selected.filter(im=>{
              if(i.product_id == im.product_id && im.isSelected == true){
                i.isSelected = true;
              }
            })
          return i;
          })
        }
        
        this.rows = res.body;
      }
    })
  }
  editProduct(data: any) {
    this.oneProduct = data
    const modalRef = this.modalService.open(AddProductsComponent,
      {
        backdrop: true, centered: true, size: 'xl',
        // modalDialogClass:'dark-bg select-city-modal'});
      });
    modalRef.componentInstance.getProductItem = this.oneProduct;

    modalRef.result.then(res=>{
      this.getProducts();
      
    },dismiss=>{
      this.getProducts();
    })
  }
  open() {
    const modalRef = this.modalService.open(AddProductsComponent,
      {
        backdrop: true, centered: true, size: 'xl',
        // modalDialogClass:'dark-bg select-city-modal'});
      });
    modalRef.componentInstance.getProductItem = '';
    modalRef.componentInstance.modalRef  = modalRef;
    modalRef.result.then(res=>{
      this.getProducts();
      
    },dismiss=>{
      this.getProducts();
    })
  }
  deleteProduct(row: any) {
    this.apiService.deleteProduct(row.product_id).subscribe((res:any)=>{
      if(!res.error){
        this.toaster.successToastr(res.msg)
        this.getProducts()
      }
      
    })
  }
  openQrModal(data?:any){
    this.qrcode = data
    const modalRef = this.modalService.open(this.content,
      {
        backdrop: false, centered: true, size: 'sm',
        // modalDialogClass:'dark-bg select-city-modal'});
      });
  }
  updateFilter(val: any) {
    if(val){
      this.keyUpFxn.next(val.target.value)
    }
  }
  changeValue(d:any,val:any){
    if(d.target.checked && !this.selected.includes(val)){
      this.selected.push(val)
    }else{
      setTimeout(() => {
        this.selected= this.selected.filter((num) => num.product_id !== val.product_id)
      }, 100);
    }
  }
  onSelect({ selected }: any,check:any) {
    if(check && this.selected.length == this.rows.length){
     this.selected = this.selected.filter((i: any) => { i.isSelected = false; return i })
     this.rows = this.rows.filter((i: any) => { i.isSelected = false; return i })
       this.selected=[]
     }
     else if(!check && this.selected.length != this.rows.length){
       this.selected = this.selected.filter((i: any) => { i.isSelected = false; return i })
       this.rows = this.rows.filter((i: any) => { i.isSelected = false; return i })
       this.selected=[]
       this.selectIdCheck = !check;
   }
   else {
     this.selected.splice(0, this.selected.length);
     this.selected.push({...selected});
     this.selected = this.selected.map((i: any) => { i.isSelected = true; return i })
     this.rows = this.rows.filter((i: any) => { i.isSelected = true; return i })
     this.selectIdCheck = !check;
   }
 }
 BulkDeletes(){
  let ids = this.selected.map(i=> {return i.product_id})
  let id={
    product_id:ids
  }
  this.apiService.bulkDelete(id).subscribe((res:any)=>{
    if(!res.error){
      this.toaster.successToastr(res.msg)
      this.getProducts('delete')
    }
  })
  
 }
 displayCheck(row: any) {
  return row.product_id !== 'Ethel Price';
}
}
