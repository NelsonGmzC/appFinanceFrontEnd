import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModulTransactionComponent } from './components/modul-transaction/modul-transaction.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ModulTransactionDialogFormComponent } from './components/modul-transaction-dialog-form/modul-transaction-dialog-form.component';
import { ModulTransactionChartComponent } from './components/modul-transaction-chart/modul-transaction-chart.component';
import { ModulSettingCategoriosComponent } from './components/modul-setting-categorios/modul-setting-categorios.component';
//import of angular material
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort"
import { MatTableModule } from "@angular/material/table"
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DialogAlertComponent } from './components/dialog-alert/dialog-alert.component';
import { ModulSettingLabelsComponent } from './components/modul-setting-labels/modul-setting-labels.component';
import { ModulSettingComponent } from './components/modul-setting/modul-setting.component';
import { ModulLoginComponent } from './components/modul-login/modul-login.component';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    ModulTransactionComponent,
    HeaderComponent,
    ModulTransactionDialogFormComponent,
    ModulTransactionChartComponent,
    ModulSettingCategoriosComponent,
    DialogAlertComponent,
    ModulSettingLabelsComponent,
    ModulSettingComponent,
    ModulLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    DragDropModule,
    MatSnackBarModule
  ],
  providers: [
    MatDatepickerModule,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
