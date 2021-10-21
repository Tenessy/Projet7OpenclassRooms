import { Component, OnInit,Input } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Edit } from '../models/edit.model';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router, RouteReuseStrategy } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.css']
})
export class EditUserComponent implements OnInit {

  userForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }
  user: any = [];
  birth: any = new DatePipe('en-US').transform
  ngOnInit(): void {
    this.initForm();
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
        data => {
          this.router.navigate(['/forum']);
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );
  }
  initForm() {
  
    this.userForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      date_de_naissance: [this.date],
      adresse: [''],
      cp: [''],
      telephone: [''],
      image: [this.file]
    });
  }

}
