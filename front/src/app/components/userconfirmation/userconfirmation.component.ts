import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-userconfirmation',
  templateUrl: './userconfirmation.component.html',
  styleUrls: ['./userconfirmation.component.css']
})
export class UserconfirmationComponent implements OnInit {


  constructor(private route: ActivatedRoute, private authService: AuthService,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    
    const token = this.route.snapshot.queryParamMap.get('token');
    console.log("token", token)
    this.authService.verifyEmail(token).subscribe({
      next: (response:any) => {
        // Handle success response
        console.log(response);
        // Uncomment the following lines if you want to use the response data
        this.snackBar.open(response.message, 'Close', {
          duration: 5000,
          verticalPosition: 'top'
        });
      },
      error: err => {
        console.log(err);
        let errorMessage=err.error.message;
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          verticalPosition: 'top'
        });
        // Handle error
      }
    }); // Added closing parenthesis
  }
}
