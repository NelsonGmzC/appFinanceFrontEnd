import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModulLoginComponent } from './components/modul-login/modul-login.component';
import { ModulSettingCategoriosComponent } from './components/modul-setting-categorios/modul-setting-categorios.component';
import { ModulSettingLabelsComponent } from './components/modul-setting-labels/modul-setting-labels.component';
import { ModulSettingComponent } from './components/modul-setting/modul-setting.component';
import { ModulTransactionComponent } from './components/modul-transaction/modul-transaction.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: ModulLoginComponent
  },
  {
    path: 'transaction',
    component: ModulTransactionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'setting',
    component: ModulSettingComponent,
    canActivate: [AuthGuard],
    children:[
      {
        path: 'categories',
        component: ModulSettingCategoriosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'labels',
        component: ModulSettingLabelsComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {path: '', pathMatch: 'full', redirectTo: 'transaction'},
  {path: '**', pathMatch: 'full', redirectTo: 'transaction'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
