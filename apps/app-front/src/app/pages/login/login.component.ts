import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

import { catchError, of, tap } from 'rxjs';
import { Login } from '../../libs/auth/auth.interface';
import { AuthService } from '../../libs/auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslocoModule],
})
export default class LoginComponent implements OnInit {
  login = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false],
  });

  error: string[] = [];
  loading = false;

  private redirectUrl = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { currentRoute: string };
    this.redirectUrl = state?.currentRoute ?? '';
  }

  doLogin() {
    if (
      !this.login.invalid &&
      this.login.value.email &&
      this.login.value.password
    ) {
      this.loading = true;
      this.auth
        .login(this.login.value as Login)
        .pipe(
          tap(() => {
            this.loading = false;
            this.redirectUrl
              ? this.router.navigateByUrl(this.redirectUrl, {})
              : this.router.navigateByUrl('');
          }),
          catchError((error) => {
            this.loading = false;
            /* this.error = [
              {
                severity: 'error',
                summary: 'Error',
                detail: error.error.error ?? 'User or password incorrect'
              }
            ]; */
            return of(null);
          })
        )
        .subscribe();
    }
  }
}
