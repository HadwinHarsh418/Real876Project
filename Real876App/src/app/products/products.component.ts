import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddProductsComponent } from './add-products/add-products.component';
import { ProductService } from './product.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.Service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { saveAs } from "file-saver";
import * as JSZip from 'jszip';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild('search', { static: false }) search: any;
  @ViewChild('content', { static: false }) content: any;
  @ViewChild('confirmatipnPopup', { static: false }) confirmatipnPopup: any;
  myFileName = 'Bulk-Upload-example.csv';
  fileUrl = 'assets/Bulk-Upload-example.xlsx'
  closeResult = '';
  temp: any[] = [];
  rows: any[] = []
  public columns: any
  oneProduct: any;
  qrcode: any;
  Loading: boolean = false;
  selectedFiles: any;
  user_id: any;
  selected: any[] = []
  public selectionType: SelectionType = SelectionType.checkbox;
  public columnMode: ColumnMode = ColumnMode.force;
  private keyUpFxn = new Subject<any>();
  selectIdCheck:boolean = true;

  constructor(private modalService: NgbModal, private apiService: ProductService, private toaster: ToastrService, private autheticationService: AuthenticationService) {
    this.keyUpFxn.pipe(
      debounceTime(1000)
    ).subscribe(searchTextValue => {
      this.getProductsById(searchTextValue)
    });
    this.autheticationService.currentUser.subscribe(res => {
      this.user_id = res.user_id
    })
  }

  ngOnInit(): void {
    this.getProductsById();
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
  getProductsById(val?: any) {
    let body = {
      searchStr: val
    }
    this.apiService.getProducts(body).subscribe((res: any) => {
      if (!res.error) {
        res.body = res.body.map((i:any)=>{i.isSelected = false; i.isAllSelected = false; return i})
        res.body = res.body.filter((i:any)=>{
          this.selected.filter(im=>{
            if(i.product_id == im.product_id && im.isSelected == true){
              i.isSelected = true;
            }
          })
        return i;
        })
        
        this.rows = this.temp = res.body;
      }
      
    })
  }
  updateFilter(val: any) {
    if (val) {
      this.keyUpFxn.next(val.target.value)
    }
  }
  editProduct(data: any) {

    this.oneProduct = data
    const modalRef = this.modalService.open(AddProductsComponent,
      {
        backdrop: false, centered: true, size: 'xl',
        // modalDialogClass:'dark-bg select-city-modal'});
      });
    modalRef.componentInstance.getProductItem = this.oneProduct;
    modalRef.result.then(res => {
      this.getProductsById();

    }, dismiss => {
      this.getProductsById();
    })
  }
  open() {
    const modalRef = this.modalService.open(AddProductsComponent,
      {
        backdrop: false, centered: true, size: 'xl',
        // modalDialogClass:'dark-bg select-city-modal'});
      });
    modalRef.componentInstance.getProductItem = '';
    modalRef.componentInstance.modalRef = modalRef;
    modalRef.result.then(res => {
      this.getProductsById()
    }, dismiss => {
      this.getProductsById()
    })
  }
  deleteProduct() {
    this.apiService.deleteProduct(this.qrcode.product_id).subscribe((res: any) => {
      if (!res.error) {
        this.toaster.success(res.msg);
        this.modalService.dismissAll()
        this.getProductsById()
      }

    })
  }

  openQrModal(data?: any, value?: any) {
    this.qrcode = value
    const modalRef = this.modalService.open(data == 'content' ? this.content : this.confirmatipnPopup,
      {
        backdrop: false, centered: true, size: `${data == 'content' ? 'sm' : 'md'}`,
        // modalDialogClass:'dark-bg select-city-modal'});
      });
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  handleFileInput(event?: any) {
    this.Loading = true;
    let d = event.target.files[0]?.type.split('/')[1]
    if (d != 'csv' && d != 'vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.toaster.error('Please Select Csv file');
      this.clearFile(event)
      this.Loading = false;
      return;
    }
    const formData = new FormData();
    formData.append('docFile', event.target.files[0]);
    formData.append('user_id', this.user_id);
    this.apiService.bulkUpload(formData).subscribe((res: any) => {
      if (!res.error) {
        this.toaster.success(res.msg)
        this.Loading = false;
        this.clearFile(event)
        this.getProductsById();
      } else {
        this.toaster.error(res.msg)
        this.Loading = false;
        this.clearFile(event)
      }
    }, error => {
      this.toaster.error('Something went wrong try again later!');
      this.Loading = false;
      this.clearFile(event)
    })
  }
  clearFile(file: any) {
    file.target.value = ""
  }
  onSelect({ selected }: any,check:any) {
    
     if(check && this.selected.length == this.rows.length){
      this.selected = this.selected.filter((i: any) => { i.isSelected = false; return i })
      this.rows = this.rows.filter((i: any) => { i.isSelected = false; return i })
        this.selected=[]
      }
      else if((!check && this.selected.length != this.rows.length) || (!check && this.selected.length == this.rows.length)){
        this.selected = this.selected.filter((i: any) => { i.isSelected = false; return i })
        this.rows = this.rows.filter((i: any) => { i.isSelected = false; return i })
        this.selected=[]
        this.selectIdCheck = !check;
    }
    else {
      this.selected.splice(0, this.selected.length);
      this.selected.push(...selected);
    console.log(this.selected);
      this.selected = this.selected.map((i: any) => { i.isSelected = true; return i })
      this.rows = this.rows.filter((i: any) => { i.isSelected = true; return i })
      this.selectIdCheck = !check;
    }
  }
  displayCheck(row: any) {
    return row.product_id !== 'Ethel Price';
  }

  base64ToBlob(base64: string): Blob {
    let arr: any = base64.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = window.atob(arr[1]);
    let n = bstr.length;
    let uint8Array = new Uint8Array(n);
    while (n--) {
      uint8Array[n] = bstr.charCodeAt(n);
    }
    const byteNumbers = new Array(uint8Array.length);

    for (let i = 0; i < uint8Array.length; i++) {
      byteNumbers[i] = bstr.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/png' });
  }
  async convertToPNG() {
    let selectedFile: any[] = []
    selectedFile = this.selected.map(i => { return i.qr_code })
    const promises = selectedFile.map((base64, index) => {
      const blob = this.base64ToBlob(base64);
      return blob
    });
    const res = await Promise.all(promises)
    const zip = new JSZip();
    this.rows
    res.forEach((blob, i) => {
      zip.file(`${this.selected[i].product_name}-${this.selected[i].manufactured_date}.png`, blob);
    })
    const zipfile = await zip.generateAsync({ type: 'blob' })
    this.downloadZipFile(zipfile);

  }
  downloadZipFile(file: any) {
    const a = document.createElement('a')
    a.download = 'QrCode.zip'
    const url = URL.createObjectURL(file)
    a.href = url;
    a.style.display = 'none'
    document.body.append(a)
    a.click();
    a.remove();
    URL.revokeObjectURL(url)
  }
}
