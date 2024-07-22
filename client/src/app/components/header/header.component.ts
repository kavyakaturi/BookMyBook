import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  username: string = '';


  constructor(public authService : AuthService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = this.authService.isLoggedIn();
      if (localStorage.getItem('username') != null) {
        this.username = localStorage.getItem('username') || 'User';
      } else {
        this.username = 'User';
        //this.username = localStorage.getItem('username') || 'User';
      }
      
    });
    
    
  }
  

  Logout(){
    localStorage.removeItem("user_id");
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    this.authService.isLoggedIn$.next(false);
    this.username = 'User';
  }

}
