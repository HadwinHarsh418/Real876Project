import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EcommerceComponent } from './ecommerce/ecommerce.component';
import { AuthGuard } from '../services/auth.gaurd';
import { DashboardService } from './dashboard.service';
import { HttpClientModule } from '@angular/common/http';

const routes = [
  {
    path: '',
    component: EcommerceComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [EcommerceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [DashboardService],
})
export class DashboardModule { }
