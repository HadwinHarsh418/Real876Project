import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from './product.service';


@NgModule({
  declarations: [
    ProductsComponent,
    AddProductsComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    CommonModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    FormsModule,
    ProductsRoutingModule,
    HttpClientModule
  ],
  providers: [ProductService],
})
export class ProductsModule { }
