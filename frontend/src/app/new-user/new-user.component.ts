import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.css']
})
export class NewUserComponent implements OnInit {
  @Input() infoUsers: any = [];
  userForm: FormGroup;
  users: any = [];

  constructor(private formBuilder: FormBuilder,
    private userSerice: UserService,
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.userSerice.getUser(id).subscribe(
      user => {
        this.users = user;
        this.infoUsers = user
        console.log(this.infoUsers)
      }
    )
  }
  editUser() {
    const id = this.route.snapshot.params['id'];
    let link = [`/user/${id}/edit`];
    this.router.navigate(link);
  }
  onSubmitForm() {
    const formValue = this.userForm.value;
    /* const newUser = new User(
       formValue['firstName'],
       formValue['lastName'],
       formValue['email'],
       formValue['drinkPreference']
     );
     this.userSerice.addUser(newUser);
     this.router.navigate(['/users']);
   }*/
  }
}
