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

/* const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/home' }
]; */
const routes: Routes = [

  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path:'admin',component:AdminComponent,canActivate:[AdminGuard]},
  { path: 'login', component: RegisterComponent },
  {path:'auth/confirm',component:UserconfirmationComponent},
  {path:'unauthorized',component:UnauthorizedComponent},
  {path:'profile',component:UserprofileComponent},
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
