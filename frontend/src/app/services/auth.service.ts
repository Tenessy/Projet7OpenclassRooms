import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject, ReplaySubject } from "rxjs";
import { User } from "../models/user.model";
import jwtdecode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private router: Router) { }
    decoded: any = '';
    signIn(result: any) {
        interface MyToken {
            user: User
        }
        const token = result.access_token;
        this.decoded = token;
        const decodedToken = jwtdecode<MyToken>(token);
        const user = decodedToken.user;
        const currentUser = {
            lastName: user.lastName,
            firstName: user.firstName,
            imageUrl: user.imageUrl,
            userId: user.userId,
            password: '',
            email: '',
        };
        this.subject.next(currentUser);
        localStorage.setItem('userToken', token);
        localStorage.setItem('currentUser', JSON.stringify({ user: currentUser }));
    }
    storage = localStorage.getItem('currentUser');
    subject = new BehaviorSubject<User | null>(JSON.parse(this.storage || '{}').user);

    myToken() {
        return localStorage.getItem('userToken');
    }
    myCurrentUser() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser === null || undefined) {
            return null;
        }
        else {
            return JSON.parse(localStorage.getItem('currentUser')!);
        }
    }
    authToken() {
        interface MyToken {
            user: User
        }
        const token = this.myToken();
        return jwtdecode<MyToken>(token!);
    }

    signOut() {
        this.subject.next(null);
        return localStorage.clear();
    }
}
