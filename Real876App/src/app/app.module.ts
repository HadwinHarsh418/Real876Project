import { NgModule } from '@angular/core';
import { BrowserModule , Title } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { LayoutModule } from './layout/layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { SharingModule } from './_helpers/brnumber.pipe';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {  JwtInterceptor } from './services/CustomHttpInterceptor';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProductsModule } from './products/products.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { ConfirmationPageComponent } from './pages/confirmation-page/confirmation-page/confirmation-page.component';
import { QrproductdetailsComponent } from './pages/qrproductdetails/qrproductdetails.component';
import { ProductService } from './products/product.service';
 

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ConfirmationPageComponent,
    QrproductdetailsComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    LayoutModule,
    DashboardModule,
    ProductsModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharingModule,
    NgxDatatableModule,
    ToastrModule.forRoot(),
    AngularSvgIconModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SocialLoginModule,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ProductService,
    Title,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            // 813079865495-o9lamn1bmbgq4t152fp1lr7mrlvbm1s2.apps.googleusercontent.com  //// This Project
            // 544890966548-05oogl98qifdpv7t9qkls5978oa06mtj.apps.googleusercontent.com // old project
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('544890966548-05oogl98qifdpv7t9qkls5978oa06mtj.apps.googleusercontent.com')
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('891491488601486')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}