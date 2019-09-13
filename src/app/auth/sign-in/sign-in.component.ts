import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, TokenPayload } from '../../authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordValidator } from '../../shared/password.validator';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  constructor(private authService: AuthenticationService, private router: Router) {}

  @ViewChild('alert', { static: false }) alert: ElementRef;

  signInForm: FormGroup;
  errorMessage: string = '';

  onSubmit() {
    this.authService.login(this.signInForm.value).subscribe(
      () => {
        this.router.navigate(['/questions']);
      },
      err => {
        if (err) {
          this.errorMessage = err.error.message;
        }
      },
    );
  }

  closeAlert() {
    this.alert.nativeElement.classList.remove('show');
    this.errorMessage = '';
  }

  ngOnInit() {
    this.signInForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, PasswordValidator.strong]),
    });
  }
}
