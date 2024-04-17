import { Component } from '@angular/core';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent {

  firstName: string="saif";
  lastName: string="moalla";
  username: string="sam1799";
  email: string="smoalla1799@gmail.com";
  role: string="user";
  saveChanges() {
    // Implement save changes functionality if needed
  }

}
