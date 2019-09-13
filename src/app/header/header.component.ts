import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedin: boolean;

  constructor(private authService: AuthenticationService) {}

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(logged => (this.isLoggedin = logged));
  }
}
