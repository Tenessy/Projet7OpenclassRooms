import { HttpInterceptor, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { User } from "../models/user.model";


@Injectable({ providedIn: 'root' })
export class AuthService {
    signIn(result: any) {
        this.subject.next(result.data[0]);
        this.userToken = result.access_token;
        localStorage.setItem('currentUser', result.access_token);
        localStorage.setItem('user', JSON.stringify({ user: result.data[0] }))
    }
    constructor(private router: Router) { }
    isAuth = false

    public userToken: any = this.getToken();
    storage = localStorage.getItem('user');
    public token: any;

    subject = new BehaviorSubject<User | null>(JSON.parse(this.storage || '{}').user);

    getToken() {
        return localStorage.getItem('currentUser');
    }
    signOut() {
        this.subject.next(null);
        return localStorage.clear();
    }
}
