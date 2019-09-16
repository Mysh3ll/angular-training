import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  @ViewChild('alert', { static: false }) alert: ElementRef;

  signInForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  onSubmit() {
    this.isLoading = true;
    this.authService.login(this.signInForm.value).subscribe(
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
    return this.signInForm.get('email');
  }

  closeAlert() {
    this.alert.nativeElement.classList.remove('show');
    this.errorMessage = '';
  }

  ngOnInit() {
    this.signInForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }
}
