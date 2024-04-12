import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = "";
  password: string = "";

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    const credentials = { username: this.username, password: this.password };
    console.log(credentials);
    this.authService.login(credentials).subscribe(
      res => {
        // Store tokens in local storage upon successful login
        console.log(res)
        this.authService.storeTokens({ access_token: res.access_token, refresh_token: res.refresh_token });
        console.log(this.authService.getToken())
        // Redirect user to the desired route
        this.router.navigate(['/home']);
      },
      error => {
        // Handle login error
      }
    ); 
  }

}
