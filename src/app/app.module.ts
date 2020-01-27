import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ConfigService } from './config.service';
import { LeadService } from './lead.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

//Material modules
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NavbarComponent } from './navbar/navbar.component';
import { UserConfigComponent, UserRemoveConfirmDialog } from './user-config/user-config.component';
import { JobsComponent } from './jobs/jobs.component';
import { LeadsComponent } from './leads/leads.component';
import { PerformanceComponent } from './performance/performance.component';
import { AccountingComponent } from './accounting/accounting.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddressRenewComponent } from './address-renew/address-renew.component';
import { KeepingRenewComponent } from './keeping-renew/keeping-renew.component';
import { MatPaginatorIntlCro } from './custom_paginator';
import { MatPaginatorIntl } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { CustomerComponent } from './customer/customer.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { InternalWorkComponent } from './internal-work/internal-work.component';
import { ExternalWorkComponent } from './external-work/external-work.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'leads', component: LeadsComponent },
  { path: 'jobs', component: JobsComponent },
  { path: 'customers', component: CustomerComponent },
  { path: 'user-config', component: UserConfigComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SidebarComponent,
    NavbarComponent,
    UserConfigComponent,
    UserRemoveConfirmDialog,
    JobsComponent,
    LeadsComponent,
    PerformanceComponent,
    AccountingComponent,
    AddressRenewComponent,
    KeepingRenewComponent,
    CustomerComponent,
    FileUploadComponent,
    InternalWorkComponent,
    ExternalWorkComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatSliderModule,
    MatCardModule,
    MatCheckboxModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatRadioModule,
    MatMenuModule,
    MatSelectModule,
    MatPaginatorModule,
    FlexLayoutModule,
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatListModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
  ],
  entryComponents: [UserConfigComponent, UserRemoveConfirmDialog],
  providers: [
    ConfigService,
    LeadService,
    { provide: LocationStrategy, useClass: PathLocationStrategy  },
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro},
    //{ provide: MatPaginatorIntl, useValue: getChinesePaginatorIntl() }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
