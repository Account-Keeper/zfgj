import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ConfigService } from './config.service';
import { LeadService } from './lead.service';
import { FileService } from './file.service';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE,MatDateFormats,NativeDateAdapter,DateAdapter } from '@angular/material'
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NavbarComponent } from './navbar/navbar.component';
import { UserConfigComponent, UserRemoveConfirmDialog } from './user-config/user-config.component';
import { JobsComponent } from './jobs/jobs.component';
import { LeadsComponent } from './leads/leads.component';
import { PerformanceComponent } from './performance/performance.component';
import { AccountingComponent, AccountingDialogComponent } from './accounting/accounting.component';
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
import { JobViewComponent } from './job-view/job-view.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'leads', component: LeadsComponent },
  { path: 'login', component: AppComponent },
  { path: 'jobs/edit/:id', component: JobsComponent },
  { path: 'jobs/add', component: JobsComponent },
  { path: 'jobs/list', component: JobViewComponent },
  { path: 'customers', component: CustomerComponent },
  { path: 'customers/list', component: CustomerViewComponent },
  { path: 'customers/view/:id', component: CustomerViewComponent },
  { path: 'user-config', component: UserConfigComponent },
  { path: 'keeping-renew/list', component: AccountingComponent },
  { path: '', component: AppComponent },
  { path: '**', redirectTo: '' }
];

export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric'
    },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};

export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      let day: string = date.getDate().toString();
      day = +day < 10 ? '0' + day : day;
      let month: string = (date.getMonth() + 1).toString();
      month = +month < 10 ? '0' + month : month;
      let year = date.getFullYear();
      return `${year}-${month}-${day}`;
    }
    return date.toDateString();
  }
}

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
    AccountingDialogComponent,
    AddressRenewComponent,
    KeepingRenewComponent,
    CustomerComponent,
    FileUploadComponent,
    InternalWorkComponent,
    ExternalWorkComponent,
    JobViewComponent,
    CustomerViewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule, 
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
    MatTooltipModule,
    MatExpansionModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
  ],
  exports:[
    CustomerComponent,
    InternalWorkComponent,
    ExternalWorkComponent
  ],
  entryComponents: [UserConfigComponent, UserRemoveConfirmDialog, AccountingDialogComponent],
  providers: [
    ConfigService,
    LeadService,
    FileService,
    { provide: LocationStrategy, useClass: PathLocationStrategy  },
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro},
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
