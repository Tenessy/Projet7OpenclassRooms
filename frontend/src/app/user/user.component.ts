import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.css']
})

export class UserComponent implements OnInit, OnDestroy {
  @Input() infoUsers: any = [];
  userForm: FormGroup;
  user: any = [];
  userSubscription = new Subscription();
  constructor(
    private userSerice: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService) { }
  userId: number | undefined;
  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.userSubscription.add(this.userSerice.getUser(id).subscribe(
      user => {
        if (user.length <= 0) {
          this.router.navigate(['/not-found']);
        }
        else {
          this.user = user;
        }
      }
    ));
    this.userSubscription.add(this.authService.subject.subscribe(
      user => {
        this.userId = user?.id;
      }
    ));
  }
  editUser() {
    const id = this.route.snapshot.params['id'];
    let link = [`/user/${id}/edit`];
    this.router.navigate(link);
  }
  isUser() {
    const id = this.route.snapshot.params['id'];
    if (JSON.stringify(this.userId) === id) {
      return true;
    }
    return false;
  }
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
