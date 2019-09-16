import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordValidator } from '../../shared/password.validator';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  @ViewChild('alert', { static: false }) alert: ElementRef;

  signUpForm: FormGroup;
  errorMessage: string = '';
  isLoading = false;

  onSubmit() {
    this.isLoading = true;
    this.authService.register(this.signUpForm.value).subscribe(
      () => {
        this.router.navigate(['/questions']);
        this.isLoading = false;
      },
      err => {
        if (err) {
          this.errorMessage = err.error.message;
          this.isLoading = false;
        }
      },
    );
  }

  get inputEmail() {
    return this.signUpForm.get('email');
  }

  get inputPassword() {
    return this.signUpForm.get('password');
  }

  closeAlert() {
    this.alert.nativeElement.classList.remove('show');
    this.errorMessage = '';
  }

  ngOnInit() {
    this.signUpForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        PasswordValidator.strong,
        Validators.minLength(8),
      ]),
    });
  }
}
