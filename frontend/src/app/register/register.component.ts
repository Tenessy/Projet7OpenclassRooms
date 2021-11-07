import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  userForm: FormGroup;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService) { }

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    let min = 100000;
    let max = 1000000;
    const userId = Math.floor(Math.random() * (max - min)) + min;
    console.log(userId);
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userId: [userId]
    });
  }
  onSubmitForm() {
    const formValue = this.userForm.value;
    const newUser = new User(
      formValue['firstName'],
      formValue['lastName'],
      formValue['email'],
      formValue['password'],
      formValue['userId']
    );
    this.userService.register(newUser)
      .subscribe(
        () => {
          console.log('La création de l\'utilisateur dans la bdd a bien été faites !' + formValue)
        },
        (error) => {
          console.log('Une erreur est survenue lors de l\'enregistrement' + error, newUser)
        }
      );
    this.router.navigate(['/login']);
  }
}


