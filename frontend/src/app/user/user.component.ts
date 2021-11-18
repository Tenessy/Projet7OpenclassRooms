import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.css']
})

export class UserComponent implements OnInit {
  @Input() infoUsers: any = [];
  userForm: FormGroup;
  user: any = [];

  constructor(
    private userSerice: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService) { }
  userId: any;
  ngOnInit(): void {
    console.log(this.isAuth())
    const id = this.route.snapshot.params['id'];
    this.userSerice.getUser(id).subscribe(
      user => {
        console.log(user);
        if (user.length <= 0) {
          return this.router.navigate(['/not-found']);
        }
        return this.user = user;
      }
    );
    this.authService.subject.subscribe(
      user => {
        this.userId = user?.id;
      }
    );
  }
  isAuth() {
    const id = JSON.parse(this.route.snapshot.params['id']);
    if (id === this.userId) {
      return true
    }
    else {
      return false;
    }
  }
  editUser() {
    const id = this.route.snapshot.params['id'];
    let link = [`/user/${id}/edit`];
    this.router.navigate(link);
  }

}
