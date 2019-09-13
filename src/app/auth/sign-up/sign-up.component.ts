import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, TokenPayload } from '../../authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordValidator } from '../../shared/password.validator';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  constructor(private authService: AuthenticationService, private router: Router) {}

  @ViewChild('alert', { static: false }) alert: ElementRef;

  signUpForm: FormGroup;
  errorMessage: string = '';

  onSubmit() {
    this.authService.register(this.signUpForm.value).subscribe(
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
    this.signUpForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, PasswordValidator.strong]),
    });
  }
}
