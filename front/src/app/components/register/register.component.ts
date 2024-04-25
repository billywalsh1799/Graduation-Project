import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { clearFormError, setCustomFormError, validatePasswordConfirmation } from 'src/app/services/methods/formUtils';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  signUpForm: FormGroup;

  registered:boolean=false
  loading: boolean = false;

  //errorMessage: string="";

  constructor(private formBuilder: FormBuilder,private authService: AuthService,private router: Router,private snackBar: MatSnackBar) {
   
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
      clearFormError(this.signUpForm,"username"); // Clear custom error when value changes
    });
    this.signUpForm.get('email')?.valueChanges.subscribe(() => {
      clearFormError(this.signUpForm,"email"); // Clear custom error when value changes
    });

    // Subscribe to value changes of password and confirmPassword controls
    this.signUpForm.get('password')?.valueChanges.subscribe(() => {
      validatePasswordConfirmation(this.signUpForm,"password","confirmPassword");
    });
    this.signUpForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      validatePasswordConfirmation(this.signUpForm,"password","confirmPassword");
    });
  }

  // Method to handle sign up form submission
  signUp() {
    if (this.signUpForm.valid) {
      // Implement registration logic here
      this.loading = true; // Enable loading spinner
      
      const {firstname,lastname,username,email,password}=this.signUpForm.value
      const userInfo={firstname,lastname,username,email,password}
      //this.signUpForm.reset({})
      this.authService.register(userInfo).subscribe({
        next: response => {
          // Handle success response
          console.log('Registration successful:', response);
          this.snackBar.open(response.message, 'Close', {
            duration: 5000,
            verticalPosition: 'top'
          });
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          let errorMessage=err.error.message;
          if(errorMessage=="User already exists"){
            console.log(errorMessage)
            setCustomFormError(this.signUpForm,"username",errorMessage)
          }
          else if(errorMessage=="Email already in use"){
            console.log(errorMessage)
            setCustomFormError(this.signUpForm,"email",errorMessage)
          }
        }
      }); 
    }
    else{
      console.log('form not valid', this.signUpForm.value);
    }
  }
}