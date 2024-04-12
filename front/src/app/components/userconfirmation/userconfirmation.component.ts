import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-userconfirmation',
  templateUrl: './userconfirmation.component.html',
  styleUrls: ['./userconfirmation.component.css']
})
export class UserconfirmationComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    
    const token = this.route.snapshot.queryParamMap.get('token');
    console.log("token",token)
    // Now you can use this.token to perform confirmation logic
    // For example, you could send an HTTP request to your Spring Boot backend to confirm the user's email address
  }

}
