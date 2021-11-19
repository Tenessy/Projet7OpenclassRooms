import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, interval, Subscription, BehaviorSubject } from 'rxjs';
import { User } from './models/user.model';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

  secondes: number;
  subscritpion = new Subscription();
  user: BehaviorSubject<User | null>;

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    const counter = interval(1000);
    this.subscritpion.add(counter.subscribe(
      (value: number) => {
        this.secondes = value;
      },
    ));
    this.user = this.authService.subject;
  }
  viewUser() {
    this.authService.subject.subscribe(
      user => {
        const link = ['/user/', user?.id];
        this.router.navigate(link);
      }
    );
  }
  signOut() {
    this.authService.signOut()
    this.router.navigate(['/login']);
  }
  ngOnDestroy() {
    this.subscritpion.unsubscribe();
  }
}
