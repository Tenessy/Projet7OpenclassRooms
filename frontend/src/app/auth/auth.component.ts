import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css',
    "../../../node_modules/bootstrap/dist/css/bootstrap.css"]
})
export class AuthComponent implements OnInit {

  authStatus: boolean;
  userForm: FormGroup;

  constructor(private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSignIn() {
   /* this.authService.signIn().then(
      () => {
        console.log('connexion résussie !');
        this.authStatus = this.authService.isAuth;
        this.router.navigate(['/forum']);
      }
    );*/
  }
  onSubmitForm() {
    this.onSignIn();
  }
  onSignOut() {
    this.authService.signOut();
    this.authStatus = this.authService.isAuth;
  }
}
