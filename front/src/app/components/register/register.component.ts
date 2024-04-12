import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  signInForm: FormGroup;
  signUpForm: FormGroup;

  registered:boolean=false

  //errorMessage: string="";

  constructor(private formBuilder: FormBuilder,private authService: AuthService,private router: Router) {
    // Initialize sign in form
    this.signInForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });

    // Subscribe to value changes of the username control
    this.signInForm.get('username')?.valueChanges.subscribe(() => {
      this.clearFormError(this.signInForm,"username"); // Clear custom error when value changes
    });

    this.signInForm.get('password')?.valueChanges.subscribe(() => {
      this.clearFormError(this.signInForm,'password'); // Clear custom error when value changes
    });

    // Initialize sign up form
    this.signUpForm = this.formBuilder.group({
      firstname:[null, Validators.required],
      lastname:[null, Validators.required],
      username: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, Validators.required]
    });


    this.signUpForm.get('username')?.valueChanges.subscribe(() => {
      this.clearFormError(this.signUpForm,"username"); // Clear custom error when value changes
    });
    this.signUpForm.get('email')?.valueChanges.subscribe(() => {
      this.clearFormError(this.signUpForm,"email"); // Clear custom error when value changes
    });

    // Subscribe to value changes of password and confirmPassword controls
    this.signUpForm.get('password')?.valueChanges.subscribe(() => {
      this.validatePasswordConfirmation();
    });
    this.signUpForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.validatePasswordConfirmation();
    });
  }

  hide:boolean = true;

  private validatePasswordConfirmation() {
    const passwordControl = this.signUpForm.get('password');
    const confirmPasswordControl = this.signUpForm.get('confirmPassword');

    // Check if password and confirmPassword fields match
    const passwordsMatch = passwordControl?.value === confirmPasswordControl?.value;

    // Set custom error on confirmPassword control if passwords don't match
    if (!passwordsMatch) {
      confirmPasswordControl?.setErrors({ 'passwordMismatch': true });
    } else {
      confirmPasswordControl?.setErrors(null); // Clear custom error if passwords match
    }
  }

  setCustomFormError(form:FormGroup,field:string,message:string) {
    const formControl = form.get(field);
    formControl?.setErrors({ customError: message }); // Set custom error for username
  }
  clearFormError(form:FormGroup,field:string) {
    const formControl = form.get(field);
    if (formControl?.errors?.['customError']) {
      formControl.setErrors(null); // Clear custom error
    }
  }
 
  
  // Method to handle sign in form submission
  signIn() {
    const credentials=this.signInForm.value
    console.log(credentials)
    if (this.signInForm.valid){

       //clear form after successful submission
      //this.signInForm.reset({});

      console.log("valid form",credentials)
       /* this.authService.login(credentials).subscribe(
        res=>{
          console.log("response",res)
        },
        err=>{
          console.log("register component error",err)
        }
      ) */

      this.authService.login(credentials).subscribe({
        next: response => {
          // Handle success response
          //console.log('Login successful:', response);
          const {access_token,refresh_token}=response
          this.authService.storeTokens({ access_token: access_token, refresh_token: refresh_token });
          //console.log(this.authService.getToken())
          // Redirect user to the desired route
          this.router.navigate(['/home']);
        },
        error: err => {
          // Handle error forwarded by the interceptor
          let errorMessage=err.error.message;
          if(errorMessage=="User not found"){
            //this.setCustomLoginError(errorMessage,"username")
            this.setCustomFormError(this.signInForm,"username",errorMessage)
          }
          else if(errorMessage=="Wrong Password"){
            //this.setCustomLoginError(errorMessage,"password")
            this.setCustomFormError(this.signInForm,"password",errorMessage)
          }
        }
      });
       
      /* this.authService.login(credentials).subscribe(
        res => {
         
          console.log(res)
          this.authService.storeTokens({ access_token: res.access_token, refresh_token: res.refresh_token });
          console.log(this.authService.getToken())
          // Redirect user to the desired route
          this.router.navigate(['/home']);
          
        },
        error => {
          
        }
      ); */
    }

    else{
      console.log("invalid form",credentials)
    } 
  }

  // Method to handle sign up form submission
  signUp() {
    if (this.signUpForm.valid) {
      // Implement registration logic here
      
      const {firstname,lastname,username,email,password}=this.signUpForm.value
      const userInfo={firstname,lastname,username,email,password}
      //this.signUpForm.reset({})
      this.authService.register(userInfo).subscribe({
        next: response => {
          // Handle success response
          console.log('Registration successful:', response);
          alert("Registration done cofirm email")
          //const {access_token,refresh_token}=response
          //this.authService.storeTokens({ access_token: access_token, refresh_token: refresh_token });
          //this.router.navigate(['/home']);
        },
        error: err => {
          let errorMessage=err.error.message;
          
          if(errorMessage=="User already exists"){
            console.log(errorMessage)
            this.setCustomFormError(this.signUpForm,"username",errorMessage)
          }
          else if(errorMessage=="Email already in use"){
            console.log(errorMessage)
            this.setCustomFormError(this.signUpForm,"email",errorMessage)
          }
        }
      }); 
    }
    else{
      console.log('form not valid', this.signUpForm.value);
    }
  }
}
