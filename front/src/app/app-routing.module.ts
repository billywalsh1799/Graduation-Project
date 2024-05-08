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
import { FileuploadComponent } from './components/fileupload/fileupload.component';
import { PdfviewertestComponent } from './components/pdfviewertest/pdfviewertest.component';
import { DocumentComponent } from './components/document/document.component';
import { ReviewerpageComponent } from './components/reviewerpage/reviewerpage.component';
import { CreatorpageComponent } from './components/creatorpage/creatorpage.component';



/* const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/home' }
]; */
const routes: Routes = [

  { path: 'home', component: HomeComponent},
  {path:'profile',component:UserprofileComponent},
  {path:'admin',component:AdminComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {path:'auth/confirm',component:UserconfirmationComponent},
  {path:'forget-password',component:ForgetpasswordComponent},
  {path:'auth/reset-password',component:ResetpasswordComponent},
  {path:'create-document',component:FileuploadComponent},
  {path:'pdf-viewer',component:PdfviewertestComponent},
  {path:'document/:id',component:DocumentComponent},
  {path:'reviewer-page',component:ReviewerpageComponent},
  {path:'creator-page',component:CreatorpageComponent},
  {path:'unauthorized',component:UnauthorizedComponent},
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }