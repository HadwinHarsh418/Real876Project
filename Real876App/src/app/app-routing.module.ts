import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './services/auth.gaurd';
import { LayoutComponent } from './layout/layout.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ConfirmationPageComponent } from './pages/confirmation-page/confirmation-page/confirmation-page.component';
import { QrproductdetailsComponent } from './pages/qrproductdetails/qrproductdetails.component';
//import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
//import { PaymentFailedComponent } from './pages/payment-failed/payment-failed.component';
//import { LandingComponent } from './pages/landing/landing.component';
//import { ConferenciaComponent } from './pages/conferencia/conferencia.component';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'register/:sponsor', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'confirmation/:id', component: ConfirmationPageComponent },
  { path: 'ProductHistory/:id', component: QrproductdetailsComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'products',
        loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
      },
      
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }


