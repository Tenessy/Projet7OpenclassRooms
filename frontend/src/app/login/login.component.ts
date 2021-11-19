import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  authStatus: boolean;
  loginForm: FormGroup;
  subscription: Subscription;

  constructor(private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    }
  }
  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      password: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmitForm() {
    const formUser = this.loginForm.value;
    const email = formUser.email;
    const password = formUser.password;
    this.userService.login(email, password)
      .subscribe({
        next: result => {
          this.authService.signIn(result);
          this.router.navigateByUrl('/forum');
        },
        error: error => {
          console.log('Une erreur est survenue lors de la connexion !' + error, email, formUser);
        }
      });
  }
  onSignOut() {
    this.authService.signOut();
  }
}
