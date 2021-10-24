import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, interval, Subscription, BehaviorSubject } from 'rxjs';
import { User } from './models/user.model';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
    "../../node_modules/bootstrap/dist/css/bootstrap.css"]
})
export class AppComponent implements OnInit, OnDestroy {

  secondes: number;
  subscritpion: Subscription;
  user: BehaviorSubject<User | null>;

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    const counter = interval(1000);
    this.subscritpion = counter.subscribe(
      (value: number) => {
        this.secondes = value;
      },
    );
    this.user = this.authService.subject;
  }

  ngOnDestroy() {
    this.subscritpion.unsubscribe();
  }
  viewUser() {
    const user: any = localStorage.getItem('user');
    const id = JSON.parse(user).user.userId;
    const link = ['/user/', id];
    this.router.navigate(link);
  }

  signOut() {
    this.authService.signOut()
    this.router.navigate(['/login']);
  }
}
