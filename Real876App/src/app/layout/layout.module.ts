

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { SharingModule } from '../_helpers/brnumber.pipe';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoreCommonModule } from 'src/@core/common.module';
import { ProductService } from '../products/product.service';
import { HttpClientModule } from '@angular/common/http';




@NgModule({
  declarations: [
    LayoutComponent,
    SidemenuComponent,
    HeaderComponent,
    FooterComponent
  ],

  exports: [
    LayoutComponent,
  ],
  
  imports: [
    CommonModule,
    RouterModule,
    SharingModule,
    FormsModule,
    TranslateModule,
    CoreCommonModule,
    HttpClientModule
  ],
  providers:[ProductService]
})
export class LayoutModule { }