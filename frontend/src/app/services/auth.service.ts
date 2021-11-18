import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/user.model";
import jwtdecode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
    subject = new BehaviorSubject<User | null>(null);
    constructor() {
        const token = this.myToken();
        if (token) {
            this.subject.next(this.getCurrentUser(token));
        }
    }
    signIn(result: any) {
        const token = result.access_token;
        this.subject.next(this.getCurrentUser(token));
        localStorage.setItem('userToken', token);
    }
    myToken() {
        return localStorage.getItem('userToken');
    }
    authToken() {
        const token = this.myToken();
        if (token) {
            return jwtdecode<User>(token);
        }
        return undefined;
    }
    signOut() {
        this.subject.next(null);
        return localStorage.clear();
    }
    getCurrentUser(token: string) {
        const user = jwtdecode<User>(token);
        console.log(user.id);
        return {
            lastName: user.lastName,
            firstName: user.firstName,
            userImageUrl: user.userImageUrl,
            id: user.id,
            password: '',
            email: '',
        };
    }
}

