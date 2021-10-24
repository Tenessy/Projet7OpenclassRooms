import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpResponse } from '@angular/common/http';
import { first } from 'rxjs/operators'
import { from, pipe, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.css']
})
export class LoginComponent implements OnInit, OnDestroy {

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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  public users: any[];

  get f() { return this.loginForm.controls; }

  onSubmitForm() {
    const formUser = this.loginForm.value; 
    const email = formUser.email;
    const password = formUser.password;
    this.subscription = this.userService.login(email, password)
      .subscribe(
        result => {
          this.authService.signIn(result);
          console.log(result);
          this.router.navigateByUrl('/forum');
        },
        error => {
          console.log('Une erreur est survenue lors de la connexion !' + error, email, formUser);

        });
  }
  onSignOut() {
    this.authService.signOut();
    this.authStatus = this.authService.isAuth;
  }

  ngOnDestroy() {
    // localStorage.removeItem('user');
    // localStorage.removeItem('currenUser');
    //  this.subscription.unsubscribe();
  }

}
