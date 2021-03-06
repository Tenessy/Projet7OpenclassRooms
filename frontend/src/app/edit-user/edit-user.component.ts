import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Edit } from '../models/edit.model';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  userForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) { }
  user: any = [];
  birth: any = new DatePipe('en-US').transform
  viewDelete: Boolean = false;
  ngOnInit(): void {
    this.initForm();
    this.authService.subject.subscribe(
      val => {
        console.log(val);
      }
    )
    const id = this.route.snapshot.params['id'];
    this.userService.getInfoUser(id)
      .subscribe(
        user => {
          console.log(user);
          this.user = user
        },
        error => {
          console.log(error);
        }
      );
  }
  date: Date = new Date();
  file: File;

  onChange(event: any) {
    this.date = event.target.value;
    console.log(this.date);
  }
  onChangeImage(event: any) {
    this.file = event.target.files[0];
    console.log(this.file);
  }
  onSubmitForm() {
    const formValue = this.userForm.value;
    const userEdit = new Edit(
      formValue['firstName'],
      formValue['lastName'],
      formValue['date_de_naissance'],
      formValue['adresse'],
      formValue['cp'],
      formValue['telephone'],
    )
    const id = this.route.snapshot.params['id'];
    const formData: any = new FormData();
    formData.append('image', this.file)
    formData.append('userEdit', JSON.stringify(userEdit))
    this.userService.editUser(id, formData)
      .subscribe(
        () => {
          this.router.navigate([`/user/${id}`]);
        }
      );
  }
  initForm() {
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.pattern('^[a-zA-Z??-??- \'\]+$')]],
      lastName: ['', [Validators.pattern('^[a-zA-Z??-??- \'\]+$')]],
      date_de_naissance: [this.date],
      adresse: ['', [Validators.pattern('^[a-zA-Z??-??0-9 \'\]+$')]],
      cp: ['', [Validators.pattern('^[0-9]{5}')]],
      telephone: ['', [Validators.pattern('^[0-9]{10}')]],
      image: [this.file]
    });
  }
  viewDeleteUser($event: any) {
    if (this.viewDelete === false) {
      this.viewDelete = true;
    }
    else {
      this.viewDelete = false;
    }
  }
  deleteUser() {
    const id = this.route.snapshot.params['id'];
    this.userService.deleteOneUser(id).subscribe(
      val => {
        console.log('Le compte a bien ??t?? supprim??' + val);
        this.authService.signOut();
        this.router.navigate(['/login']);
      },
      err => {
        console.log(err)
      }
    );
  }
}
