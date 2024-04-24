import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guard/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminGuard } from './guard/admin.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { UserconfirmationComponent } from './components/userconfirmation/userconfirmation.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { LoginComponent } from './components/login/login.component';
import { ForgetpasswordComponent } from './components/forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

/* const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/home' }
]; */
const routes: Routes = [

  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path:'profile',component:UserprofileComponent},
  {path:'admin',component:AdminComponent,canActivate:[AdminGuard]},
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {path:'auth/confirm',component:UserconfirmationComponent},
  {path:'forget-password',component:ForgetpasswordComponent},
  {path:'auth/reset-password',component:ResetpasswordComponent},
  {path:'file-upload',component:FileUploadComponent},
  {path:'unauthorized',component:UnauthorizedComponent},
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
