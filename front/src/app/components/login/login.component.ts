import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { clearFormError, setCustomFormError } from 'src/app/services/methods/formUtils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  hide:boolean = true;

  constructor(private formBuilder: FormBuilder,private authService: AuthService,private router: Router,private snackBar: MatSnackBar){
     // Initialize sign in form
     this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });

    // Subscribe to value changes of the username control
    this.loginForm.get('email')?.valueChanges.subscribe(() => {
      clearFormError(this.loginForm,"email"); // Clear custom error when value changes
    });

    this.loginForm.get('password')?.valueChanges.subscribe(() => {
       clearFormError(this.loginForm,'password'); // Clear custom error when value changes
    });
  }
  
  // Method to handle sign in form submission
  login() {
    const credentials=this.loginForm.value
    console.log(credentials)
    if (this.loginForm.valid){
       //clear form after successful submission
      //this.loginForm.reset({});
      console.log("valid form",credentials)
      this.authService.login(credentials).subscribe({
        next: response => {
          // Handle success response
          const {access_token,refresh_token}=response
          this.authService.storeTokens({ access_token: access_token, refresh_token: refresh_token });
          // Redirect user to the desired route
          this.router.navigate(['/home']);
        },
        error: err => {
          // Handle error forwarded by the interceptor
          console.log("error from login",err)
          let errorMessage=err.error.message;
          console.log(errorMessage)
          if(errorMessage=="Bad credentials"){
            setCustomFormError(this.loginForm,"password",errorMessage)
          }
          else{
           setCustomFormError(this.loginForm,"email",errorMessage)
          }
        }
      });
       
    }
    else{
      console.log("invalid form",credentials)
    } 
  }

}