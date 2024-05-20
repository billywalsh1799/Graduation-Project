import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './guard/auth.guard';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';

//angular material added modules
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from './components/admin/admin.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import { UpdatepopupComponent } from './components/updatepopup/updatepopup.component';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { UserconfirmationComponent } from './components/userconfirmation/userconfirmation.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { PasswordresetpopupComponent } from './components/passwordresetpopup/passwordresetpopup.component';
import { FileuploadComponent } from './components/fileupload/fileupload.component'; 
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { LoginComponent } from './components/login/login.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { ForgetpasswordComponent } from './components/forgetpassword/forgetpassword.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { DocumentComponent } from './components/document/document.component';
import { CommentsComponent } from './components/comments/comments.component';
import { ReviewerpageComponent } from './components/reviewerpage/reviewerpage.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CreatorpageComponent } from './components/creatorpage/creatorpage.component';
import { FileDropComponent } from './components/file-drop/file-drop.component';
import { ValidationspopupComponent } from './components/validationspopup/validationspopup.component';
import { NotifierComponent } from './components/notifier/notifier.component';
import { UploadedDocumentsComponent } from './components/uploaded-documents/uploaded-documents.component';
import { ReviewerStatisticsComponent } from './components/reviewer-statistics/reviewer-statistics.component';





@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    AdminComponent,
    UnauthorizedComponent,
    UpdatepopupComponent,
    UserconfirmationComponent,
    UserprofileComponent,
    PasswordresetpopupComponent,
    FileuploadComponent,
    LoginComponent,
    ResetpasswordComponent,
    ForgetpasswordComponent,
    DocumentComponent,
    CommentsComponent,
    ReviewerpageComponent,
    CreatorpageComponent,
    FileDropComponent,
    ValidationspopupComponent,
    NotifierComponent,
    UploadedDocumentsComponent,
    ReviewerStatisticsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,MatTabsModule,MatInputModule,MatButtonModule,MatIconModule,MatSnackBarModule, BrowserAnimationsModule,
    MatTableModule,MatPaginatorModule,MatSortModule,MatDialogModule,MatSelectModule,MatCheckboxModule,MatProgressSpinnerModule,
    MatChipsModule,MatAutocompleteModule,MatDividerModule,MatSidenavModule,MatListModule,MatToolbarModule,MatMenuModule
    ,MatProgressBarModule
    
  ],
  providers: [AuthGuard,{ provide: HTTP_INTERCEPTORS,useClass: AuthInterceptor,multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
